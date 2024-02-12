export * from "./compiler-core";
export * from "./compiler-dom";
export * from "./compiler-sfc";
export * from "./reactivity";
export * from "./runtime-core";
export * from "./runtime-dom";
export * from "./shared";

import {
  compile,
  type InternalRenderFunction,
  registerRuntimeCompiler,
} from "chibivue";

import * as runtimeDom from "./runtime-dom";

const compileToFunction = (template: string): InternalRenderFunction =>
  new Function("_chibivue", compile(template))(runtimeDom);

registerRuntimeCompiler(compileToFunction);
