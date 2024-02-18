import { baseParse, type CompilerOptions, generate } from "../compiler-core";

export const baseCompile = (
  template: string,
  options: Required<CompilerOptions>,
) => {
  const parseResult = baseParse(template.trim());

  return generate(parseResult, options);
};
