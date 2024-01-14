import { track, trigger } from "chibivue";
import { reactive } from "chibivue";

export const mutableHandlers: ProxyHandler<object> = {
  get: (target, key, receiver) => {
    track(target, key);

    const res = Reflect.get(target, key, receiver);
    if (res !== null && typeof res === "object") return reactive(res);

    return res;
  },

  set: (target, key, value, receiver) => {
    let oldValue = (target as any)[key];
    Reflect.set(target, key, receiver);

    if (hasChanged(value, oldValue)) trigger(target, key);

    return true;
  },
};

const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue);
