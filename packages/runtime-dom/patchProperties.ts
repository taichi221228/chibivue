import { type RendererOptions } from "../runtime-core";

import { patchAttributes } from "./modules/attributes";
import { patchEvent } from "./modules/events";

type DOMRendererOptions = RendererOptions<Node, Element>;

const onRE = /^on[^a-z]/;

export const isOn = (key: string) => onRE.test(key);

export const patchProperty: DOMRendererOptions["patchProperty"] = (
  element,
  key,
  value,
) => {
  if (isOn(key)) {
    patchEvent(element, key, value);
  } else {
    patchAttributes(element, key, value);
  }
};
