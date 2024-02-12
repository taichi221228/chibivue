import { type Plugin } from "vite";

export default (): Plugin => ({
  name: "vite:chibivue",
  transform: (code, _id) => ({ code }),
});
