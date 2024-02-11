export interface ComponentOptions {
  props?: Record<string, any>;
  setup?: (
    props: ComponentOptions["props"],
    ctx: { emit: (event: string, ...args: any[]) => void },
  ) => Function | Record<string, unknown> | void;
  render?: Function;
  template?: string;
}
