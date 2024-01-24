import {
  type Component,
  type ComponentInternalInstance,
  createComponentInstance,
  createVNode,
  initProps,
  type InternalRenderFunction,
  normalizeVNode,
  ReactiveEffect,
  Text,
  type VNode,
} from "chibivue";

export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement,
> {
  createElement: (type: string) => HostElement;
  createText: (text: string) => HostNode;
  patchProp: (el: HostElement, key: string, value: any) => void;
  setElementText: (node: HostNode, text: string) => void;
  setText: (node: HostNode, text: string) => void;
  insert(child: HostNode, parent: HostNode, anchor?: HostNode | null): void;
  parentNode(node: HostNode): HostNode | null;
}

export interface RendererNode extends Node {}

export interface RendererElement extends Element {}

export type RootRenderFunction<HostElement = RendererElement> = (
  vnode: Component,
  container: HostElement,
) => void;

export function createRenderer(options: RendererOptions) {
  const {
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    insert: hostInsert,
    parentNode: hostParentNode,
  } = options;

  const patch = (n1: VNode | null, n2: VNode, container: RendererElement) => {
    if (n2.type === Text) processText(n1, n2, container);
    else if (typeof n2.type === "string") processElement(n1, n2, container);
    else if (typeof n2.type === "object") processComponent(n1, n2, container);
    else {}
  };

  const processText = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
  ) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children as string), container);
    } else if (n2.children !== n1.children) {
      hostSetText(n2.el = n1.el!, n2.children as string);
    }
  };

  const processElement = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
  ) => {
    if (n1 === null) mountElement(n2, container);
    else patchElement(n1, n2);
  };

  const mountElement = (vnode: VNode, container: RendererElement) => {
    const { props } = vnode;
    let el: RendererElement;
    el = vnode.el = hostCreateElement(vnode.type as string);

    mountChildren(vnode.children as VNode[], el);

    if (props) {
      Object.entries(props).forEach(([key]) =>
        hostPatchProp(el, key, props[key])
      );
    }

    hostInsert(el, container);
  };

  const mountChildren = (children: VNode[], container: RendererElement) =>
    children.forEach((_, i) =>
      patch(null, children[i] = normalizeVNode(children[i]), container)
    );

  const patchElement = (n1: VNode, n2: VNode) => {
    const el = (n2.el = n1.el!) as RendererElement;
    const props = n2.props;

    patchChildren(n1, n2, el);

    if (props) {
      Object.entries(props).forEach(([key]) => {
        if (props[key] !== (n1.props?.[key] ?? {})) {
          hostPatchProp(el, key, props[key]);
        }
      });
    }
  };

  const patchChildren = (n1: VNode, n2: VNode, container: RendererElement) => {
    const c1 = n1.children as VNode[];
    const c2 = n2.children as VNode[];

    c2.forEach((_, i) =>
      patch(c1[i], c2[i] = normalizeVNode(c2[i]), container)
    );
  };

  const processComponent = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
  ) => {
    if (n1 === null) mountComponent(n2, container);
    else updateComponent(n1, n2);
  };

  const mountComponent = (
    initialVnode: VNode,
    container: RendererElement,
  ) => {
    const instance: ComponentInternalInstance =
      (initialVnode.component = createComponentInstance(initialVnode));

    initProps(instance, instance.vnode.props);

    const component = initialVnode.type as Component;
    if (component.setup) {
      instance.render = component.setup(
        instance.props,
      ) as InternalRenderFunction;
    }

    setupRenderEffect(instance, initialVnode, container);
  };

  const updateComponent = (n1: VNode, n2: VNode) => {
    const instance = (n2.component = n1.component)!;
    instance.next = n2;
    instance.update();
  };

  const setupRenderEffect = (
    instance: ComponentInternalInstance,
    initialVnode: VNode,
    container: RendererElement,
  ) => {
    const componentUpdate = () => {
      if (!instance.isMounted) {
        const subTree = (instance.subTree = normalizeVNode(instance.render()));
        patch(null, subTree, container);
        initialVnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        let { next, vnode } = instance;

        if (next) {
          next.el = vnode.el;
          next.component = vnode.component;
          instance.vnode = next;
          instance.next = null;
        } else {
          next = vnode;
        }

        const prevTree = instance.subTree;
        const nextTree = normalizeVNode(instance.render());
        instance.subTree = nextTree;

        patch(
          prevTree,
          nextTree,
          hostParentNode(prevTree.el!) as RendererElement,
        );
        next.el = nextTree.el;
      }
    };

    const effect = (instance.effect = new ReactiveEffect(componentUpdate));
    const update = (instance.update = () => effect.run());
    update();
  };

  const render: RootRenderFunction = (rootComponent, container) => {
    const vnode = createVNode(rootComponent, {}, []);
    patch(null, vnode, container);
  };

  return { render };
}
