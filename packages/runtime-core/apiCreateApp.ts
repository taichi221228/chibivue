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
        const componentRender = rootComponent.setup!();

        const updateComponent = () => {
          const vnode = componentRender();
          render(vnode, rootContainer);
        };

        const effect = new ReactiveEffect(updateComponent);
        effect.run();
      },
    };
    return app;
  };
};
