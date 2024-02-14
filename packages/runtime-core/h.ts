import { createVNode, type VNode } from "./vnode";

export const h = (
  type: string | object,
  properties: VNode["properties"],
  children: VNode["children"],
) => {
  return createVNode(type, properties, children);
};
