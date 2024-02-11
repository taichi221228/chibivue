import {
  camelize,
  type ComponentInternalInstance,
  type Data,
  hasOwn,
  reactive,
} from "chibivue";

export type Properties = Record<string, PropertyOptions | null>;

export interface PropertyOptions<T = any> {
  type?: PropertyType<T> | true | null;
  required?: boolean;
  default?: null | undefined | object;
}

export type PropertyType<T> = { new (...args: any[]): T & {} };

export const initProperties = (
  instance: ComponentInternalInstance,
  rawProperties: Data | null,
) => {
  const properties: Data = {};
  setFullProperties(instance, rawProperties, properties);
  instance.properties = reactive(properties);
};

export const updateProperties = (
  instance: ComponentInternalInstance,
  rawProperties: Data | null,
) => {
  Object.entries(rawProperties ?? {}).forEach(([key, value]) =>
    instance.properties[camelize(key)] = value
  );
};

const setFullProperties = (
  instance: ComponentInternalInstance,
  rawProperties: Data | null,
  properties: Data,
) => {
  const options = instance.propertiesOptions;

  if (rawProperties) {
    Object.entries(rawProperties).forEach(([key, value]) => {
      let camelizedKey;

      if (
        options &&
        hasOwn(
          options,
          camelizedKey = camelize(key),
        )
      ) properties[camelizedKey] = value;
    });
  }
};
