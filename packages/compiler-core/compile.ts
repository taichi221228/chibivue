import { baseParse, type CompilerOptions, generate } from "../compiler-core";

export const baseCompile = (
  template: string,
  options: Required<CompilerOptions>,
) => generate(baseParse(template.trim()), options);
