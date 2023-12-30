import { createApp, h } from "chibivue";

const app = createApp({
  render: () =>
    h("div", {}, [
      h("h1", {}, ["Hello, Chibivue!"]),
      h("p", {}, ["This is nested paragraph."]),
      h("div", {}, [
        h("span", {}, ["This is nested span."]),
        h("button", {}, ["Click me!"]),
      ]),
      "This is a text node.",
    ]),
});

app.mount("#app");
