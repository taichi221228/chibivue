import {
  compile,
  type InternalRenderFunction,
  registerRuntimeCompiler,
} from "chibivue";

import * as runtimeDom from "./runtime-dom";

const compileToFunction = (template: string): InternalRenderFunction =>
  new Function("_chibivue", compile(template))(runtimeDom);

registerRuntimeCompiler(compileToFunction);
