import { type RendererOptions } from "chibivue";

type DOMRendererOptions = RendererOptions<Node, Element>;

const onRE = /^on[^a-z]/;

export const isOn = (key: string) => onRE.test(key);

export const patchProp: DOMRendererOptions["patchProp"] = (_el, key, _value) => {
  if (isOn(key)) {
    // TODO: work in progress
  } else {
    // TODO: work in progress
  }
};
