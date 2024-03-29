import { type RendererOptions } from "../runtime-core";

export const nodeOps: Omit<RendererOptions, "patchProperty"> = {
  createElement: (tagName) => document.createElement(tagName),
  createText: (text) => document.createTextNode(text),
  setElementText: (node, text) => node.textContent = text,
  setText: (node, text) => node.nodeValue = text,
  insert: (child, parent, anchor) => parent.insertBefore(child, anchor || null),
  parentNode: (node) => node.parentNode,
};
