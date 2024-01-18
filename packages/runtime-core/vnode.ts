import { type RendererNode } from "chibivue";

export interface VNode<HostNode = RendererNode> {
  type: VNodeTypes;
  props: VNodeProps | null;
  children: VNodeNormalizedChildren;
  el: HostNode | undefined;
}

export type VNodeTypes = string | typeof Text;

export interface VNodeProps {
  [key: string]: any;
}

export type VNodeChild = VNodeChildAtom | VNodeArrayChildren;

type VNodeChildAtom = VNode | string;

export type VNodeArrayChildren = Array<VNodeChildAtom | VNodeArrayChildren>;

export type VNodeNormalizedChildren = string | VNodeArrayChildren;

export const Text = Symbol();

export const createVNode = (
  type: VNodeTypes,
  props: VNodeProps | null,
  children: VNodeNormalizedChildren,
): VNode => ({ type, props, children, el: undefined });

export const normalizeVNode = (child: VNodeChild): VNode => {
  if (typeof child === "object") return { ...child } as VNode;
  else return createVNode(Text, null, child + "");
};
