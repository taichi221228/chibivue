import {
  camelize,
  type ComponentInternalInstance,
  toHandlerKey,
} from "chibivue";

export const emit = (
  instance: ComponentInternalInstance,
  event: string,
  ...rawArguments: any[]
) => {
  const properties = instance.vnode.properties || {};

  let _arguments = rawArguments;
  let handler = properties[toHandlerKey(event)] ||
    properties[toHandlerKey(camelize(event))];

  handler?.(..._arguments);
};
