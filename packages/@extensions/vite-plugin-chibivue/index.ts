import { createFilter, type Plugin } from "vite";

export default (): Plugin => {
  const filter = createFilter(/\.vue$/);

  return {
    name: "vite:chibivue",
    transform: (code, id) => {
      if (!filter(id)) return;
      return {
        // TODO: Implement the transform function
        code: "export default {}",
      };
    },
  };
};
