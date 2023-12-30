import { VNode } from "./vnode";

export const h = (
  type: VNode["type"],
  props: VNode["props"],
  children: VNode["children"],
) => {
  return { type, props, children };
};
