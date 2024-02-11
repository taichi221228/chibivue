import {
  type ComponentOptions,
  emit,
  initProperties,
  type Properties,
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
  properties: Data;
  propertiesOptions: Properties;
  emit: (event: string, ..._arguments: any[]) => void;
  setupState: Data;
}

export type InternalRenderFunction = {
  (context: Data): VNodeChild;
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
    properties: {},
    propertiesOptions: (vnode.type as Component).properties || {},
    emit: null! as (event: string, ..._arguments: any[]) => void,
    setupState: {},
  };

  instance.emit = emit.bind(null, instance);

  return instance;
};

export const setupComponent = (
  instance: ComponentInternalInstance,
) => {
  initProperties(instance, instance.vnode.properties);

  const component = instance.type;
  if (component.setup) {
    const setupResult = component.setup(component.properties, {
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
