import type { ContentScriptContext } from "wxt/client";
import { createApp } from "vue";
import App from "./App.vue";
import "uno.css";
import "@unocss/reset/tailwind-compat.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createUi(ctx);
    ui.mount();
  //   ctx.addEventListener(window, "mouseup", async (e) => {
  //       const selection = window.getSelection();
  //       if (!selection || selection?.toString().trim() === '' || selection?.rangeCount === 0) {
  //           ui.remove();
  //           return;
  //       }
        
  //       const range = selection.getRangeAt(0);
  //       const selectedText = range.toString();
  //       const rects = range.getClientRects();

  //       if (rects.length === 0) {
  //           return;
  //       }

  //       const firstLineRect = rects[0];

  //       const scrollX = window.scrollX || window.pageXOffset;
  //       const scrollY = window.scrollY || window.pageYOffset;

  //       const startX = firstLineRect.left + scrollX;
  //       const startY = firstLineRect.top + scrollY;
  //       const width = firstLineRect.width;
  //       const height = firstLineRect.height;

  //       ui.uiContainer.style.position = "absolute";
  //       ui.uiContainer.style.left = `${startX}px`;
  //       ui.uiContainer.style.top = `${startY - 80}px`;
        
  //       if (!ui.mounted) {
  //         ui.mount();
  //       }
  //   });
  },
});

function createUi(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: "selection-toolbar",
    position: "inline",
    onMount: (container) => {
      // Define how your UI will be mounted inside the container
      const app = createApp(App);
      app.mount(container);
      return app;
    },
    onRemove: (app) => {
      // Unmount the app when the UI is removed
      app?.unmount();
    },
  });
}
