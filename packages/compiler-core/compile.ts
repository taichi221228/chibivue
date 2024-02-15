import { baseParse, type CompilerOptions, generate } from "../compiler-core";

export const baseCompile = (
  template: string,
  options: Required<CompilerOptions>,
) => {
  const parseResult = baseParse(template.trim());

  console.log(
    "🚀 ~ file: compile.ts:6 ~ baseCompile ~ parseResult:",
    parseResult,
  );

  return generate(parseResult, options);
};
