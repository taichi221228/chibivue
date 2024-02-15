export * from "./nodeOps";
export * from "./patchProperties";
export * from "./modules/attributes";
export * from "./modules/events";

export { h } from "../runtime-core";

import {
  createAppAPI,
  type CreateAppFunction,
  createRenderer,
  type RendererElement,
} from "../runtime-core";

import { nodeOps } from "./nodeOps";
import { patchProperty } from "./patchProperties";

const renderer = createRenderer({ ...nodeOps, patchProperty });
const _createAppAPI = createAppAPI(renderer.render);

export const createApp: CreateAppFunction<Element> = (...parameters) => {
  const app = _createAppAPI(...parameters);
  const { mount } = app;

  app.mount = (selector: RendererElement | string) => {
    const container = typeof selector === "string"
      ? document.querySelector(selector)
      : selector;
    if (!container) return;

    mount(container);
  };

  return app;
};
