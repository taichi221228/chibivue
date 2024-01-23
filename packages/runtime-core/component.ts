import {
  type ComponentOptions,
  type Props,
  type ReactiveEffect,
  type VNode,
  type VNodeChild,
} from "chibivue";

export type Data = Record<string, unknown>;

export type Component = ComponentOptions;

export interface ComponentInternalInstance {
  type: Component;
  vnode: VNode;
  subTree: VNode;
  next: VNode | null;
  effect: ReactiveEffect;
  render: InternalRenderFunction;
  update: () => void;
  isMounted: boolean;
  props: Data;
  propsOptions: Props;
}

export type InternalRenderFunction = {
  (): VNodeChild;
};

export const createComponentInstance = (
  vnode: VNode,
): ComponentInternalInstance => ({
  type: vnode.type as Component,
  vnode,
  subTree: null!,
  next: null,
  effect: null!,
  render: null!,
  update: null!,
  isMounted: false,
  props: {},
  propsOptions: (vnode.type as Component).props || {},
});
