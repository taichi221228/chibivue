import { createDependence, type Dependence } from "chibivue";

type KeyToDependenciesMap = Map<any, Dependence>;

const targetMap = new WeakMap<any, KeyToDependenciesMap>();

export let activeEffect: ReactiveEffect | undefined;

export class ReactiveEffect<T = any> {
  constructor(public callback: () => T) {}

  run() {
    let parent: ReactiveEffect | undefined = activeEffect;
    activeEffect = this;
    const result = this.callback();
    activeEffect = parent;
    return result;
  }
}

export const track = (target: object, key: unknown) => {
  let dependenciesMap = targetMap.get(target);
  if (!dependenciesMap) targetMap.set(target, dependenciesMap = new Map());

  let dependence = dependenciesMap.get(key);
  if (!dependence) dependenciesMap.set(key, dependence = createDependence());

  if (activeEffect) dependence.add(activeEffect);
};

export const trigger = (target: object, key?: unknown) => {
  const dependenceMap = targetMap.get(target);
  if (!dependenceMap) return;

  const dependence = dependenceMap.get(key);
  if (dependence) {
    const effects = [...dependence];
    effects.forEach((effect) => effect.run());
  }
};
