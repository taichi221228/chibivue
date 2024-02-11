import { track, trigger } from "chibivue";
import { reactive } from "chibivue";

export const mutableHandlers: ProxyHandler<object> = {
  get: (target, key, receiver) => {
    track(target, key);

    const result = Reflect.get(target, key, receiver);
    if (result !== null && typeof result === "object") return reactive(result);

    return result;
  },

  set: (target, key, value, receiver) => {
    let oldValue = (target as any)[key];
    Reflect.set(target, key, value, receiver);

    if (hasChanged(value, oldValue)) trigger(target, key);

    return true;
  },
};

const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue);
