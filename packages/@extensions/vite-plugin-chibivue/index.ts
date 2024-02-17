import { createFilter, type Plugin } from "vite";

import { compile } from "../../compiler-dom";
import { parse, rewriteDefault } from "../../compiler-sfc";

export default (): Plugin => {
  const filter = createFilter(/\.vue$/);

  return {
    name: "vite:chibivue",
    transform: (code, id) => {
      if (!filter(id)) return;

      const SFC_MAIN = "_sfc_main";

      const { descriptor } = parse(code, { filename: id });

      const scriptCode = rewriteDefault(
        descriptor.script?.content ?? "",
        SFC_MAIN,
      );
      const templateCode = compile(descriptor.template?.content ?? "", {
        isBrowser: false,
      });

      console.log(
        "🚀 ~ file: index.ts:14 ~ transform ~ descriptor:",
        descriptor,
      );

      return {
        code: `import * as _chibivue from "chibivue";
          ${scriptCode}
          ${templateCode}
          export default { render };`,
      };
    },
  };
};
