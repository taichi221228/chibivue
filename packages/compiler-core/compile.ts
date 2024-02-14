import { baseParse, generate } from "../compiler-core";

export const baseCompile = (template: string) => {
  const parseResult = baseParse(template.trim());

  console.log(
    "🚀 ~ file: compile.ts:6 ~ baseCompile ~ parseResult:",
    parseResult,
  );

  return generate(parseResult);
};
