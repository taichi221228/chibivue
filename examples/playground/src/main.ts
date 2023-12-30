import { createApp, h } from "chibivue";

const app = createApp({
  render: () => h("div", {}, ["Hello Chibivue!"]),
});

app.mount("#app");
