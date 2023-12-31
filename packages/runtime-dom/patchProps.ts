import { patchEvent, type RendererOptions } from "chibivue";

type DOMRendererOptions = RendererOptions<Node, Element>;

const onRE = /^on[^a-z]/;

export const isOn = (key: string) => onRE.test(key);

export const patchProp: DOMRendererOptions["patchProp"] = (
  el,
  key,
  value,
) => {
  if (isOn(key)) {
    patchEvent(el, key, value);
  } else {
    // TODO: work in progress
  }
};
