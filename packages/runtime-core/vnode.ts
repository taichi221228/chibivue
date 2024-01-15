export type VNodeTypes = string | typeof Text;

export interface VNode {
  type: VNodeTypes;
  props: VNodeProps;
  children: (VNode | string)[];
}

export interface VNodeProps {
  [key: string]: any;
}

export const Text = Symbol();

export const createVNode = (
  type: VNodeTypes,
  props: VNodeProps,
  children: VNode["children"],
): VNode => ({ type, props, children });
