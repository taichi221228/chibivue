import { createVNode, type VNode } from "chibivue";

export const h = (
  type: VNode["type"],
  props: VNode["props"],
  children: VNode["children"],
) => {
  return createVNode(type, props, children);
};
