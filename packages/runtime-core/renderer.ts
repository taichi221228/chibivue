import { type VNode } from "./vnode";

export interface RendererOptions<HostNode = RenderNode> {
  createElement: (type: string) => HostNode;

  createText: (text: string) => HostNode;

  setElementText: (node: HostNode, text: string) => void;

  insert(child: HostNode, parent: HostNode, anchor?: HostNode | null): void;
}

export interface RenderNode extends Node {
  // TODO: work in progress
}

export interface RenderElement extends RenderNode {
  // TODO: work in progress
}

export type RootRenderFunction<HostElement = RenderElement> = (
  message: string,
  container: HostElement,
) => void;

export function createRenderer(options: RendererOptions) {
  const {
    createElement: hostCreateElement,
    createText: hostCreateText,
    insert: hostInsert,
  } = options;

  function renderVNode(vnode: VNode | string) {
    if (typeof vnode === "string") return hostCreateText(vnode);

    const el = hostCreateElement(vnode.type);

    for (let child of vnode.children) {
      const childEl = renderVNode(child);
      hostInsert(childEl, el);
    }

    return el;
  }

  const render: RootRenderFunction = (vnode, container) => {
    const el = renderVNode(vnode);
    hostInsert(el, container);
  };

  return { render };
}
