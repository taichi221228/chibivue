export interface ComponentOptions {
  props?: Record<string, any>;
  setup?: (
    props: ComponentOptions["props"],
    ctx: { emit: (event: string, ...args: any[]) => void },
  ) => Function | void;
  render?: Function;
  template?: string;
}
