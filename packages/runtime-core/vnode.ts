import { type ComponentInternalInstance } from "./component";
import { type RendererNode } from "./renderer";

export interface VNode<HostNode = RendererNode> {
  type: VNodeTypes;
  properties: VNodeProperties | null;
  children: VNodeNormalizedChildren;
  element: HostNode | undefined;
  component: ComponentInternalInstance | null;
}

export type VNodeTypes = string | typeof Text | object;

export interface VNodeProperties {
  [key: string]: any;
}

export type VNodeChild = VNodeChildAtom | VNodeArrayChildren;

type VNodeChildAtom = VNode | string;

export type VNodeArrayChildren = Array<VNodeChildAtom | VNodeArrayChildren>;

export type VNodeNormalizedChildren = string | VNodeArrayChildren;

export const Text = Symbol();

export const createVNode = (
  type: VNodeTypes,
  properties: VNodeProperties | null,
  children: VNodeNormalizedChildren,
): VNode => ({ type, properties, children, element: undefined, component: null });

export const normalizeVNode = (child: VNodeChild): VNode => {
  if (typeof child === "object") return { ...child } as VNode;
  else return createVNode(Text, null, child + "");
};
