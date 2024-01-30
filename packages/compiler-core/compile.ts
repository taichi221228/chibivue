import { baseParse, generate } from "chibivue";

export const _baseCompile = (template: string) => generate(baseParse(template));
