import { createApp } from "chibivue";

const app = createApp({
  template: `<div
    class="container"
  >
    <h1 style="font-size: 60px;">Hello, Chibivue!</h1>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png"
      alt="Vue.js Logo"
      width="260"
    />
    <p style="font-size: 20px;">
      <b>Chibivue</b> is the minimal Vue.js
    </p>
    <style>
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        height: 100svh;
      }
      
      #app {
        height: 100%;
      }
      
      .container {
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        gap: 48px;
        box-sizing: border-box;
        height: 100%;
        padding: 16px;
        background-color: whitesmoke;
        color: dimgray;
      }
    </style>
  </div>`,
});

app.mount("#app");
