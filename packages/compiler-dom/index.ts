import { baseCompile, baseParse } from "../compiler-core";

export const compile = (template: string) => baseCompile(template);

export const parse = (template: string) => baseParse(template);
