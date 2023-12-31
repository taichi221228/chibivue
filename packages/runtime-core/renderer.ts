import { type VNode } from "chibivue";

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

export interface RendererNode extends Node {
  // TODO: work in progress
}

export interface RendererElement extends Element {
  // TODO: work in progress
}

export type RootRenderFunction<HostElement = RendererElement> = (
  message: string,
  container: HostElement,
) => void;

export const createRenderer = (options: RendererOptions) => {
  const {
    createElement: hostCreateElement,
    createText: hostCreateText,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options;

  const renderVNode = (vnode: VNode | string) => {
    if (typeof vnode === "string") return hostCreateText(vnode);

    const el = hostCreateElement(vnode.type);

    Object.entries(vnode.props).forEach(([key, value]) => {
      hostPatchProp(el, key, value);
    });

    for (let child of vnode.children) {
      const childEl = renderVNode(child);
      hostInsert(childEl, el);
    }

    return el;
  };

  const render: RootRenderFunction = (vnode, container) => {
    const el = renderVNode(vnode);
    hostInsert(el, container);
  };

  return { render };
};
