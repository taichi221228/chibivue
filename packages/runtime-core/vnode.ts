export interface VNode<HostNode = any> {
  type: VNodeTypes;
  props: VNodeProps | null;
  children: VNodeNormalizedChildren;
}

export type VNodeTypes = string | typeof Text;

export interface VNodeProps {
  [key: string]: any;
}

type VNodeChild = VNodeChildAtom | VNodeArrayChildren;

type VNodeChildAtom = VNode | string;

export type VNodeArrayChildren = Array<VNodeChildAtom | VNodeArrayChildren>;

export type VNodeNormalizedChildren = string | VNodeArrayChildren;

export const Text = Symbol();

export const createVNode = (
  type: VNodeTypes,
  props: VNodeProps | null,
  children: VNodeNormalizedChildren,
): VNode => ({ type, props, children });

export const normalizeVNode = (child: VNodeChild): VNode => {
  if (typeof child === "object") {
    return { ...child } as VNode;
  } else {
    return createVNode(Text, null, child + "");
  }
};
