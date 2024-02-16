const defaultExportRE = /((?:^|\n|;)\s*)export\s+default\s+/;
const namedDefaultExportRE = /((?:^|\n|;)\s*)export(.+)(?:as)?(\s*)default/s;

export const rewriteDefault = (input: string, as: string): string => {
  // TODO: Impl
  return "";
};
