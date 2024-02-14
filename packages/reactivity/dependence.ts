import { type ReactiveEffect } from "./effect";

export type Dependence = Set<ReactiveEffect>;

export const createDependence = (effects?: ReactiveEffect[]): Dependence =>
  new Set(effects);
