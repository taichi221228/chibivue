export interface ComponentOptions {
  props?: Record<string, any>;
  setup?: (props: ComponentOptions["props"]) => Function;
  render?: Function;
}
