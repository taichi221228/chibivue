import { camelize, toHandlerKey } from "../shared";

import { type ComponentInternalInstance } from "./component";

export const emit = (
  instance: ComponentInternalInstance,
  event: string,
  ...rawArguments: any[]
) => {
  const properties = instance.vnode.properties || {};

  let parameters = rawArguments;
  let handler = properties[toHandlerKey(event)] ||
    properties[toHandlerKey(camelize(event))];

  handler?.(...parameters);
};
