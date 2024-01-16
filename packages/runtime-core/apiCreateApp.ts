import {
  type Component,
  ReactiveEffect,
  type RootRenderFunction,
} from "chibivue";

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
        render(rootComponent, rootContainer);
      },
    };
    return app;
  };
};
