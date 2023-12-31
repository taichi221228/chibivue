import { VNode } from "chibivue";

export const h = (
  type: VNode["type"],
  props: VNode["props"],
  children: VNode["children"],
) => {
  return { type, props, children };
};
