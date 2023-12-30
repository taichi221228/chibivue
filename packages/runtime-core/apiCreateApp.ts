import { type Component } from "./component";
import { type RootRenderFunction } from "./renderer";

export interface App<HostElement = any> {
  mount: (rootContainer: HostElement | string) => void;
}

export type CreateAppFunction<HostElement> = (
  rootComponent: Component,
) => App<HostElement>;

export const createAppAPI = <HostElement>(
  render: RootRenderFunction<HostElement>,
): CreateAppFunction<HostElement> => {
  return (rootComponent) => {
    const app: App = {
      mount(rootContainer: HostElement) {
        const vnode = rootComponent.render!();
        render(vnode, rootContainer);
      },
    };
    return app;
  };
};
