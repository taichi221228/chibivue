import { mutableHandlers } from "chibivue";

export const reactive = <T extends object>(target: T): T =>
  new Proxy(target, mutableHandlers) as T;
