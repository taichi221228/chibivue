import { type VNode } from "chibivue";

export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement,
> {
  createElement: (type: string) => HostElement;

  createText: (text: string) => HostNode;

  setElementText: (node: HostNode, text: string) => void;

  insert(child: HostNode, parent: HostNode, anchor?: HostNode | null): void;
}

export interface RendererNode {
  // TODO: work in progress
  [key: string]: any;
}

export interface RendererElement extends RendererNode {
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
    insert: hostInsert,
  } = options;

  const renderVNode = (vnode: VNode | string) => {
    if (typeof vnode === "string") return hostCreateText(vnode);

    const el = hostCreateElement(vnode.type);

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
