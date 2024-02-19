import { ReactiveEffect } from "../reactivity";

import {
  type Component,
  type ComponentInternalInstance,
  createComponentInstance,
  setupComponent,
} from "./component";
import { updateProperties } from "./componentProperties";
import { createVNode, normalizeVNode, Text, type VNode } from "./vnode";

export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement,
> {
  createElement: (type: string) => HostElement;
  createText: (text: string) => HostNode;
  patchProperty: (el: HostElement, key: string, value: any) => void;
  setElementText: (node: HostNode, text: string) => void;
  setText: (node: HostNode, text: string) => void;
  insert: (child: HostNode, parent: HostNode, anchor?: HostNode | null) => void;
  parentNode: (node: HostNode) => HostNode | null;
}

export interface RendererNode extends Node {}

export interface RendererElement extends Element {}

export type RootRenderFunction<HostElement = RendererElement> = (
  vnode: Component,
  container: HostElement,
) => void;

export const createRenderer = (options: RendererOptions) => {
  const {
    patchProperty: hostPatchProperty,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    insert: hostInsert,
    parentNode: hostParentNode,
  } = options;

  const patch = (node1: VNode | null, node2: VNode, container: RendererElement) => {
    if (node2.type === Text) processText(node1, node2, container);
    else if (typeof node2.type === "string") processElement(node1, node2, container);
    else if (typeof node2.type === "object") processComponent(node1, node2, container);
    else {}
  };

  const processText = (
    node1: VNode | null,
    node2: VNode,
    container: RendererElement,
  ) => {
    if (node1 == null) {
      hostInsert(node2.el = hostCreateText(node2.children as string), container);
    } else {
      const el = (node2.el = node1.el!);
      if (node2.children !== node1.children) hostSetText(el, node2.children as string);
    }
  };

  const processElement = (
    node1: VNode | null,
    node2: VNode,
    container: RendererElement,
  ) => {
    if (node1 === null) mountElement(node2, container);
    else patchElement(node1, node2);
  };

  const mountElement = (vnode: VNode, container: RendererElement) => {
    let el: RendererElement;
    el = vnode.el = hostCreateElement(vnode.type as string);

    mountChildren(vnode.children as VNode[], el);

    if (vnode.properties) {
      Object.entries(vnode.properties).forEach(([key, value]) =>
        hostPatchProperty(el, key, value)
      );
    }

    hostInsert(el, container);
  };

  const mountChildren = (children: VNode[], container: RendererElement) =>
    children.forEach((_, i) =>
      patch(null, children[i] = normalizeVNode(children[i]), container)
    );

  const patchElement = (node1: VNode, node2: VNode) => {
    const el = (node2.el = node1.el!) as RendererElement;
    const properties = node2.properties;

    patchChildren(node1, node2, el);

    if (properties) {
      Object.entries(properties).forEach(([key]) => {
        if (properties[key] !== (node1.properties?.[key] ?? {})) {
          hostPatchProperty(el, key, properties[key]);
        }
      });
    }
  };

  const patchChildren = (node1: VNode, node2: VNode, container: RendererElement) => {
    const children1 = node1.children as VNode[];
    const children2 = node2.children as VNode[];

    children2.forEach((_, i) =>
      patch(children1[i], children2[i] = normalizeVNode(children2[i]), container)
    );
  };

  const processComponent = (
    node1: VNode | null,
    node2: VNode,
    container: RendererElement,
  ) => {
    if (node1 === null) mountComponent(node2, container);
    else updateComponent(node1, node2);
  };

  const mountComponent = (
    initialVnode: VNode,
    container: RendererElement,
  ) => {
    const instance: ComponentInternalInstance =
      (initialVnode.component = createComponentInstance(initialVnode));

    setupComponent(instance);

    setupRenderEffect(instance, initialVnode, container);
  };

  const updateComponent = (node1: VNode, node2: VNode) => {
    const instance = (node2.component = node1.component)!;
    instance.next = node2;
    instance.update();
  };

  const setupRenderEffect = (
    instance: ComponentInternalInstance,
    initialVnode: VNode,
    container: RendererElement,
  ) => {
    const componentUpdate = () => {
      if (!instance.isMounted) {
        const subTree = (instance.subTree = normalizeVNode(
          instance.render(instance.setupState),
        ));
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
          updateProperties(instance, next.properties);
        } else {
          next = vnode;
        }

        const prevTree = instance.subTree;
        const nextTree = normalizeVNode(instance.render(instance.setupState));
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
};
