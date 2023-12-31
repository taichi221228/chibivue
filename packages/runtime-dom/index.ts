export * from "./nodeOps";
export * from "./patchProps";

import {
  createAppAPI,
  type CreateAppFunction,
  createRenderer,
  nodeOps,
  patchProp,
  type RendererElement,
} from "chibivue";

const { render } = createRenderer({ ...nodeOps, patchProp });
const _createAppAPI = createAppAPI(render);

export const createApp = ((...args) => {
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
}) as CreateAppFunction<Element>;
