import {
  type ComponentOptions,
  type ReactiveEffect,
  type VNode,
  type VNodeChild,
} from "chibivue";

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
});
