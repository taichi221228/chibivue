export interface ComponentOptions {
  properties?: Record<string, any>;
  setup?: (
    properties: ComponentOptions["properties"],
    context: { emit: (event: string, ..._arguments: any[]) => void },
  ) => Function | Record<string, unknown> | void;
  render?: Function;
  template?: string;
}
