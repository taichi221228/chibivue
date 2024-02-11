import {
  type ComponentOptions,
  emit,
  initProps,
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
  emit: (event: string, ...args: any[]) => void;
  setupState: Data;
}

export type InternalRenderFunction = {
  (): VNodeChild;
};

export type CompileFunction = (template: string) => InternalRenderFunction;

export const createComponentInstance = (
  vnode: VNode,
): ComponentInternalInstance => {
  const instance = {
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
    emit: null! as (event: string, ...args: any[]) => void,
    setupState: {},
  };

  instance.emit = emit.bind(null, instance);

  return instance;
};

export const setupComponent = (
  instance: ComponentInternalInstance,
) => {
  const { type, vnode, emit } = instance;

  initProps(instance, vnode.props);

  const { props, setup, render, template } = type;
  if (setup) {
    const setupResult = setup(props, { emit }) as InternalRenderFunction;

    if (typeof setupResult === "function") instance.render = setupResult;
    else if (typeof setupResult === "object" && setupResult !== null) {
      instance.setupState = setupResult;
    }
  }

  if (compile && !render) instance.render = compile(template ?? "");
};

let compile: CompileFunction | undefined;
export const registerRuntimeCompiler = (_compile: any) => (compile = _compile);
