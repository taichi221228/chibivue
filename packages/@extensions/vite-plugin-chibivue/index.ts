import { createFilter, type Plugin } from "vite";

import { parse } from "../../compiler-sfc";

export default (): Plugin => {
  const filter = createFilter(/\.vue$/);

  return {
    name: "vite:chibivue",
    transform: (code, id) => {
      if (!filter(id)) return;

      const { descriptor } = parse(code, { filename: id });

      console.log(
        "🚀 ~ file: index.ts:14 ~ transform ~ descriptor:",
        descriptor,
      );

      return {
        // TODO: Implement the transform function
        code: "export default {}",
      };
    },
  };
};
