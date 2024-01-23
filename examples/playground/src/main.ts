import { createApp, h, reactive } from "chibivue";

const TextComponent = {
  props: { message: { type: String } },
  setup: ({ message }: { message: string }) => () =>
    h("p", {}, [`message: ${message ?? "undefined"}`]),
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
    const state = reactive({ message: "Hello, Chibivue!" });

    return () =>
      h("div", { id: "chibivue" }, [
        h(CounterComponent, {}, []),
        h(CounterComponent, {}, []),
        h(CounterComponent, {}, []),
        h(TextComponent, { message: state.message }, []),
      ]);
  },
});

app.mount("#app");
