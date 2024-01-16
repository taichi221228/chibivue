import { Text, type VNode } from "chibivue";

export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement,
> {
  createElement: (type: string) => HostElement;

  createText: (text: string) => HostNode;

  patchProp: (el: HostElement, key: string, value: any) => void;

  setElementText: (node: HostNode, text: string) => void;

  insert(child: HostNode, parent: HostNode, anchor?: HostNode | null): void;
}

export interface RendererNode extends Node {}

export interface RendererElement extends Element {}

export type RootRenderFunction<HostElement = RendererElement> = (
  message: string,
  container: HostElement,
) => void;

export const createRenderer = (
  options: RendererOptions,
): { render: RootRenderFunction } => {
  const {
    createElement: hostCreateElement,
    createText: hostCreateText,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options;

  const patch = (n1: VNode | null, n2: VNode, container: RendererElement) => {
    const { type } = n2;
    if (type === Text) processText();
    else processElement();
  };

  const processText = () => {};
  const processElement = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
  ) => {
    if (n1 === null) mountElement(n2, container);
    else patchElement();
  };

  const mountElement = (vnode: VNode, container: RendererElement) => {
    const { type, props } = vnode;
    let el: RendererElement;
    el = vnode.el = hostCreateElement(type as string);

    mountChildren();

    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, props[key]);
      }
    }

    hostInsert(el, container);
  };

  const mountChildren = () => {};

  const patchElement = () => {};

  const render = () => {};

  return { render };
};
