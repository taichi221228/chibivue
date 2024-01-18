import {
  type Component,
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
  } = options;

  const patch = (n1: VNode | null, n2: VNode, container: RendererElement) => {
    const { type } = n2;
    if (type === Text) processText(n1, n2, container);
    else processElement(n1, n2, container);
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
    const { type, props } = vnode;
    let el: RendererElement;
    el = vnode.el = hostCreateElement(type as string);

    mountChildren(vnode.children as VNode[], el);

    if (props) for (const key in props) hostPatchProp(el, key, props[key]);

    hostInsert(el, container);
  };

  const mountChildren = (children: VNode[], container: RendererElement) =>
    children.forEach((_, i) =>
      patch(null, children[i] = normalizeVNode(children[i]), container)
    );

  const patchElement = (n1: VNode, n2: VNode) => {
    const el = (n2.el = n1.el!) as RendererElement
    const props = n2.props;

    patchChildren(n1, n2, el);

    for (const key in props) {
      if (props[key] !== (n1.props?.[key] ?? {})) {
        hostPatchProp(el, key, props[key]);
      }
    }
  };

  const patchChildren = (n1: VNode, n2: VNode, container: RendererElement) => {
    const c1 = n1.children as VNode[];
    const c2 = n2.children as VNode[];

    c2.forEach((_, i) =>
      patch(c1[i], c2[i] = normalizeVNode(c2[i]), container)
    );
  };

  const render: RootRenderFunction = (rootComponent, container) => {
    const componentRender = rootComponent.setup!();

    let n1: VNode | null = null;

    const updateComponent = () => {
      const n2 = componentRender();
      patch(n1, n2, container);
      n1 = n2;
    };

    const effect = new ReactiveEffect(updateComponent);
    effect.run();
  };

  return { render };
}
