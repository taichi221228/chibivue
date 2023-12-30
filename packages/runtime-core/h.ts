import { VNode } from "./vnode";

export function h(
  type: VNode["type"],
  props: VNode["props"],
  children: VNode["children"],
) {
  return { type, props, children };
}
