import { baseParse, generate } from "chibivue";

export const baseCompile = (template: string) => generate(baseParse(template));
