import {
  camelize,
  type ComponentInternalInstance,
  type Data,
  hasOwn,
  reactive,
} from "chibivue";

export type Props = Record<string, PropOptions | null>;

export interface PropOptions<T = any> {
  type?: PropType<T> | true | null;
  required?: boolean;
  default?: null | undefined | object;
}

export type PropType<T> = { new (...args: any[]): T & {} };

export const initProps = (
  instance: ComponentInternalInstance,
  rawProps: Data | null,
) => {
  const props: Data = {};
  setFullProps(instance, rawProps, props);
  instance.props = reactive(props);
};

export const updateProps = (
  instance: ComponentInternalInstance,
  rawProps: Data | null,
) => {
  Object.entries(rawProps ?? {}).forEach(([key, value]) =>
    instance.props[camelize(key)] = value
  );
};

const setFullProps = (
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  props: Data,
) => {
  const options = instance.propsOptions;

  if (rawProps) {
    Object.entries(rawProps).forEach(([key, value]) => {
      let camelizedKey;

      if (
        options &&
        hasOwn(
          options,
          camelizedKey = camelize(key),
        )
      ) props[camelizedKey] = value;
    });
  }
};
