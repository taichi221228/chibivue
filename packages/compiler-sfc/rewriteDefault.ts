import { parse } from "@babel/parser";
import MagicString from "magic-string";

const defaultExportRE = /((?:^|\n|;)\s*)export\s+default\s+/;
const namedDefaultExportRE = /((?:^|\n|;)\s*)export(.+)(?:as)?(\s*)default/s;

export const rewriteDefault = (input: string, as: string): string => {
  if (!hasDefaultExport(input)) {
    return `${input}
    const ${as} = {};`;
  }

  const _string = new MagicString(input);
  const ast = parse(input, { sourceType: "module" }).program.body;

  ast.forEach((node) => {
    // TODO: Impl
  });

  return "";
};

export const hasDefaultExport = (input: string): boolean =>
  defaultExportRE.test(input) || namedDefaultExportRE.test(input);
