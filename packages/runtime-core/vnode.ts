export interface VNode {
  type: string;
  props: VNodeProps;
  children: (VNode | string)[];
}

export interface VNodeProps {
  [key: string]: any;
}

export const createVNode = (
  type: VNode["type"],
  props: VNodeProps,
  children: VNode["children"],
): VNode => ({ type, props, children });
