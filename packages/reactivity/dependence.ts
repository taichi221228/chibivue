import { type ReactiveEffect } from "chibivue";

export type Dependence = Set<ReactiveEffect>;

export const createDependence = (effects?: ReactiveEffect[]): Dependence =>
  new Set(effects);
