export interface RendererOptions<HostNode = RenderNode> {
  setElementText: (node: HostNode, text: string) => void;
}

export interface RenderNode extends Node {
  // TODO: work in progress
}

// TODO: work in progress
export interface RenderElement extends RenderNode {
}

export type RootRenderFunction<HostElement = RenderElement> = (
  message: string,
  container: HostElement,
) => void;

export function createRenderer(options: RendererOptions) {
  const { setElementText: hostElementText } = options;

  const render: RootRenderFunction = (message, container) => {
    // TODO: work in progress. This is just a placeholder.
    hostElementText(container, message);
  };

  return { render };
}
