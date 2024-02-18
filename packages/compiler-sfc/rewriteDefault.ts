import { parse } from "@babel/parser";
import MagicString from "magic-string";

const defaultExportRE = /((?:^|\n|;)\s*)export(\s*)default/;
const namedDefaultExportRE = /((?:^|\n|;)\s*)export(.+)(?:as)?(\s*)default/s;

export const rewriteDefault = (input: string, as: string): string => {
  if (!hasDefaultExport(input)) {
    return `${input}
    const ${as} = {};`;
  }

  const string = new MagicString(input);
  const ast = parse(input, { sourceType: "module" }).program.body;

  ast.forEach((node) => {
    if (node.type === "ExportDefaultDeclaration") {
      if (node.declaration.type === "ClassDeclaration") {
        // `export default class Foo {}` -> `class Foo {}`
        string.overwrite(node.start!, node.declaration.id?.start!, "class ");
        // `const ${as} = Foo`
        string.append(`const ${as} = ${node.declaration.id?.name};`);
      } else {
        // eg 1) `export default { setup: () => {} }` -> `const ${as} = { setup: () => {} }`
        // eg 2) `export default Foo` -> `const ${as} = Foo`
        string.overwrite(
          node.start!,
          node.declaration.start!,
          `const ${as} = `,
        );
      }
    }

    // eg 1) `export { default } from "foo";`
    // eg 2) `export { foo as default } from "foo";`
    // eg 3) `export { foo as default };`
    if (node.type === "ExportNamedDeclaration") {
      for (const specifier of node.specifiers) {
        if (
          specifier.type === "ExportSpecifier" &&
          specifier.exported.type === "Identifier" &&
          specifier.exported.name === "default"
        ) {
          // has `from` clause
          if (node.source) {
            if (specifier.local.name === "default") {
              const end = specifierEnd(input, specifier.local.end!, node.end!);

              string.prepend(
                `import { default as __CHIBIVUE_DEFAULT_ } from "${node.source.value}";`,
              );
              string.overwrite(specifier.start!, end, "");
              string.append(`const ${as} = __CHIBIVUE_DEFAULT_;`);

              continue;
            } else {
              // `export { foo as default } from "foo";` -> `import { foo } from "foo"; const ${as} = foo;`
              const end = specifierEnd(
                input,
                specifier.exported.end!,
                node.end!,
              );

              string.prepend(
                `import { ${
                  input.slice(specifier.local.start!, specifier.local.end!)
                } } from "${node.source.value}";`,
              );
              string.overwrite(specifier.start!, end, "");
              string.append(`const ${as} = ${specifier.local.name};`);

              continue;
            }
          }

          const end = specifierEnd(input, specifier.end!, node.end!);

          string.overwrite(specifier.start!, end, "");
          string.append(`const ${as} = ${specifier.local.name};`);
        }
      }
    }
  });

  return string.toString();
};

export const hasDefaultExport = (input: string): boolean =>
  defaultExportRE.test(input) || namedDefaultExportRE.test(input);

const specifierEnd = (
  input: string,
  end: number,
  nodeEnd: number,
) => {
  let hasCommas = false;
  let oldEnd = end;

  while (end < nodeEnd) {
    if (/s/.test(input.charAt(end))) end++;
    else if (input.charAt(end) === ",") {
      hasCommas = true;
      end++;
      break;
    } else if (input.charAt(end) === "}") break;
  }

  return hasCommas ? end : oldEnd;
};
