import { createApp, h, reactive } from "chibivue";

const app = createApp({
  setup: () => {
    const state = reactive({ count: 0 });
    const increment = () => state.count++;

    return () =>
      h("div", { id: "chibivue" }, [
        h("h1", {}, [
          "count: ",
          h("span", {}, [state.count + ""]),
        ]),
        h("button", { onClick: increment }, ["increment!"]),
      ]);
  },
});

app.mount("#app");
