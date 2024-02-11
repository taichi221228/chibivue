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
  (ctx: Data): VNodeChild;
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
  initProps(instance, instance.vnode.props);

  const component = instance.type;
  if (component.setup) {
    const setupResult = component.setup(component.props, {
      emit: instance.emit,
    }) as InternalRenderFunction;

    if (typeof setupResult === "function") instance.render = setupResult;
    else if (typeof setupResult === "object" && setupResult !== null) {
      instance.setupState = setupResult;
    }
  }

  if (compile && !component.render) {
    instance.render = compile(component.template ?? "");
  }
};

let compile: CompileFunction | undefined;
export const registerRuntimeCompiler = (_compile: any) => (compile = _compile);
