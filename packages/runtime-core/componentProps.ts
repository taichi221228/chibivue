import { type ComponentInternalInstance, type Data, reactive } from "chibivue";

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

const setFullProps = (
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  props: Data,
) => {
  const options = instance.propsOptions;

  if (rawProps) {
    Object.entries(rawProps).forEach(([key, value]) => {
      if (options && options.hasOwnProperty(key)) props[key] = value;
    });
  }
};
