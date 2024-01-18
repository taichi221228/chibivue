import { createVNode, type VNode } from "chibivue";

export const h = (
  type: string | object,
  props: VNode["props"],
  children: VNode["children"],
) => {
  return createVNode(type, props, children);
};
