import { baseCompile, baseParse, type CompilerOptions } from "../compiler-core";

export const compile = (template: string, options?: CompilerOptions) => {
  const defaultOptions: Required<CompilerOptions> = { isBrowser: true };
  if (options) Object.assign(defaultOptions, options);
  return baseCompile(template, defaultOptions);
};

export const parse = (template: string) => baseParse(template);
