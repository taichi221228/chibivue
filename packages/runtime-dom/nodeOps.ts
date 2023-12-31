import { type RendererOptions } from "chibivue";

export const nodeOps: RendererOptions<Node> = {
  createElement: (tagName) => document.createElement(tagName),

  createText: (text) => document.createTextNode(text),

  setElementText(node, text) {
    node.textContent = text;
  },

  insert(child, parent, anchor) {
    parent.insertBefore(child, anchor || null);
  },
};
