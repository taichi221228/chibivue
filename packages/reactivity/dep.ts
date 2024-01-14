import { type ReactiveEffect } from "chibivue";

export type Dep = Set<ReactiveEffect>;

export const createDep = (effects?: ReactiveEffect[]): Dep => new Set(effects);
