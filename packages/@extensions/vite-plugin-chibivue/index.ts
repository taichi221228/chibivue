import fs from "node:fs";
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

      const { descriptor } = parse(code, { fileName: id });

      const scriptCode = rewriteDefault(
        descriptor.script?.content ?? "",
        SFC_MAIN,
      );
      const templateCode = compile(descriptor.template?.content ?? "", {
        isBrowser: false,
      });

      return {
        code: `import * as _chibivue from "chibivue";
          import "${id}.css";

          ${scriptCode}
          ${templateCode}

          export default { ...${SFC_MAIN}, render };`,
      };
    },

    load: (id) => {
      if (id.match(/\.vue\.css$/)) {
        const fileName = id.replace(/\.css$/, "");
        const content = fs.readFileSync(fileName, "utf-8");
        const { descriptor } = parse(content, { fileName });

        return {
          code: descriptor.styles.map((style) => style.content).join("\n"),
        };
      }
    },

    resolveId: (id) => {
      if (id.match(/\.vue\.css$/)) return id;
    },
  };
};
