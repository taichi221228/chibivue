import { createFilter, type Plugin } from "vite";

import { compile } from "../../compiler-dom";
import { parse } from "../../compiler-sfc";

export default (): Plugin => {
  const filter = createFilter(/\.vue$/);

  return {
    name: "vite:chibivue",
    transform: (code, id) => {
      if (!filter(id)) return;

      const { descriptor } = parse(code, { filename: id });
      const templateCode = compile(descriptor.template?.content ?? "", {
        isBrowser: false,
      });

      console.log(
        "🚀 ~ file: index.ts:14 ~ transform ~ descriptor:",
        descriptor,
      );

      return {
        code: `import * as _chibivue from "chibivue";
          ${templateCode}
          export default { render };`,
      };
    },
  };
};
