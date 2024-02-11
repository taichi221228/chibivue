export * from "./nodeOps";
export * from "./patchProperties";
export * from "./modules/attributes";
export * from "./modules/events";

export { h } from "../runtime-core";

import {
  createAppAPI,
  type CreateAppFunction,
  createRenderer,
  nodeOps,
  patchProperty,
  type RendererElement,
} from "chibivue";

const renderer = createRenderer({ ...nodeOps, patchProperty });
const _createAppAPI = createAppAPI(renderer.render);

export const createApp: CreateAppFunction<Element> = (..._arguments) => {
  const app = _createAppAPI(..._arguments);
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
