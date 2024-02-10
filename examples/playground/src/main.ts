import { createApp } from "chibivue";

const app = createApp({
  template: `<div
    class="container"
    style="display: flex;flex-direction: column;justify-content: center;align-items: center;gap: 48px;"
  >
    <h1>Hello, Chibivue!</h1>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png"
      alt="Vue.js Logo"
      width="150"
    />
    <p>
      <b>Chibivue</b> is the minimal Vue.js
    </p>
    <style>
      .container {
        height: 100svh;
        padding: 16px;
        background-color: whitesmoke;
        color: dimgray;
      }
    </style>
  </div>`,
});

app.mount("#app");
