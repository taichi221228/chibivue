import { createApp } from "chibivue";

const app = createApp({
  setup: () => {
    Promise.resolve(() => {
      const [button] = document.getElementsByTagName("button");
      button && button.addEventListener("click", () => {
        const [heading] = document.getElementsByTagName("h1");
        heading && (heading.textContent += "!");
      });
    }).then((fn) => fn());
  },

  template: `<div class="container">
    <h1 style="font-size: 60px;">Hello, Chibivue!</h1>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png"
      alt="Vue.js Logo"
      width="260"
    />
    <p style="font-size: 20px;">
      <b>Chibivue</b> is the minimal Vue.js
    </p>
    <button>Click me!</button>
    <style>
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        height: 100svh;
      }
      
      #app {
        height: 100%;
        
        & > .container {
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          gap: 24px;
          box-sizing: border-box;
          height: 100%;
          padding: 16px;
          background-color: whitesmoke;
          color: dimgray;
          
          & * {
            color: inherit;
          }
          
          & h1 {
            margin: 60px 0;
          }
          
          & p {
            margin: 40px 0 20px;
          }
          
          & button {
            padding: 8px 16px;
            font-size: 20px;
            border: 1px solid dimgray;
            border-radius: 4px;   
            cursor: pointer;
            transition: filter 0.3s;
            &:hover {
              filter: brightness(0.9);
            }
          }
        }
      }
    </style>
  </div>`,
});

app.mount("#app");
