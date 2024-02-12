import { baseCompile, baseParse } from "chibivue";

export const compile = (template: string) => baseCompile(template);

export const parse = (template: string) => baseParse(template);
