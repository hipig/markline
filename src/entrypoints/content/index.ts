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
    ctx.addEventListener(window, "mouseup", async (e) => {
        const selection = window.getSelection();
        if (!selection || selection?.rangeCount === 0) {
            // ui.remove();
            return;
        }
        
        const range = selection.getRangeAt(0);
        const rects = range.getClientRects();

        if (rects.length === 0) {
            return;
        }

        const firstLineRect = rects[0];

        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        const startX = firstLineRect.left + scrollX;
        const startY = firstLineRect.top + scrollY;
        const endX = firstLineRect.right + scrollX;
        const endY = firstLineRect.bottom + scrollY;

        console.log('第一行起始坐标:', { x: startX, y: startY });
        console.log('第一行结束坐标:', { x: endX, y: endY });

        const extractedContent = range.extractContents();
        const wrapper = document.createElement('span');
        wrapper.className = 'highlight';
        wrapper.setAttribute('data-start', `${startX},${startY}`);
        wrapper.setAttribute('data-end', `${endX},${endY}`);
        wrapper.appendChild(extractedContent);
        range.insertNode(wrapper);
        // ui.mount();
    });
  },
});

function mainWatch(ctx: ContentScriptContext) {
    console.log(1111);
    ctx.addEventListener(window, "selectionchange", async () => {
        const selection = window.getSelection();
        console.log(selection.toString());
        const ui = await createUi(ctx);
        ui.mount();
    });
}

function createUi(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: "selection-toolbar",
    position: "inline",
    anchor: "body",
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
