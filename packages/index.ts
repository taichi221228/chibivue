export { h } from "./runtime-core";
export { createApp } from "./runtime-dom";
export { reactive } from "./reactivity";

import { compile } from "./compiler-dom";
import {
  type InternalRenderFunction,
  registerRuntimeCompiler,
} from "./runtime-core";

import * as runtimeDom from "./runtime-dom";

const compileToFunction = (template: string): InternalRenderFunction =>
  new Function("_chibivue", compile(template))(runtimeDom);

registerRuntimeCompiler(compileToFunction);
