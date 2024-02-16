import { parse } from "@babel/parser";
import MagicString from "magic-string";

const defaultExportRE = /((?:^|\n|;)\s*)export\s+default\s+/;
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
  });

  return "";
};

export const hasDefaultExport = (input: string): boolean =>
  defaultExportRE.test(input) || namedDefaultExportRE.test(input);
