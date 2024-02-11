export * from "./nodeOps";
export * from "./patchProps";
export * from "./modules/attrs";
export * from "./modules/events";

export { h } from "../runtime-core";

import {
  createAppAPI,
  type CreateAppFunction,
  createRenderer,
  nodeOps,
  patchProp,
  type RendererElement,
} from "chibivue";

const renderer = createRenderer({ ...nodeOps, patchProp });
const _createAppAPI = createAppAPI(renderer.render);

export const createApp: CreateAppFunction<Element> = (...args) => {
  const app = _createAppAPI(...args);
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
