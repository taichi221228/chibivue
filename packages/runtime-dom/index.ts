import {
  createAppAPI,
  type CreateAppFunction,
  createRenderer,
  type RenderElement,
} from "../runtime-core";
import { nodeOps } from "./nodeOps";

const { render } = createRenderer(nodeOps);
const _createAppAPI = createAppAPI(render);

export const createApp = ((...args) => {
  const app = _createAppAPI(...args);
  const { mount } = app;

  app.mount = (selector: RenderElement | string) => {
    const container = typeof selector === "string"
      ? document.querySelector(selector)
      : selector;
    if (!container) return;
    mount(container);
  };

  return app;
}) as CreateAppFunction<Element>;
