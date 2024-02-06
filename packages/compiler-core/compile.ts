import { baseParse } from "./parse";

export const baseCompile = (template: string) => {
  const parseResult = baseParse(template.trim());
  console.log(
    "🚀 ~ file: compile.ts:6 ~ baseCompile ~ parseResult:",
    parseResult,
  );
  return "";
};
