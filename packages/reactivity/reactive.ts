import { mutableHandlers } from "./baseHandler";

export const reactive = <T extends object>(target: T): T =>
  new Proxy(target, mutableHandlers) as T;
