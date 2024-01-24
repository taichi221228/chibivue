import { createApp, h, reactive } from "chibivue";

const TextComponent = {
  props: { kebabMessage: { type: String } },
  setup: (props: { kebabMessage: string }) => () =>
    h("p", {}, [`kebab-message: ${props ? props.kebabMessage : "undefined"}`]),
};

const CounterComponent = {
  setup: () => {
    const state = reactive({ count: 0 });
    const increment = () => state.count++;

    return () =>
      h("div", {}, [
        h("p", {}, [`count: ${state.count}`]),
        h("button", { onClick: increment }, ["increment!"]),
      ]);
  },
};

const app = createApp({
  setup: () => {
    const state = reactive({ message: "Hello, Chibivue" });

    return () =>
      h("div", { id: "chibivue" }, [
        h(CounterComponent, {}, []),
        h(CounterComponent, {}, []),
        h(CounterComponent, {}, []),
        h(TextComponent, { "kebab-message": state.message }, []),
        h("button", { onClick: () => (state.message += "!") }, ["add!"]),
      ]);
  },
});

app.mount("#app");
