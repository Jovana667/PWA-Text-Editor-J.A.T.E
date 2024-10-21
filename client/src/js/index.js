import { Workbox } from "workbox-window";
import Editor from "./editor";
import { getDb, putDb } from "./database";
import "../css/style.css";

const main = document.querySelector("#main");
main.innerHTML = "";

const loadSpinner = () => {
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  spinner.innerHTML = `
  <div class="loading-container">
  <div class="loading-spinner" />
  </div>
  `;
  main.appendChild(spinner);
};

const editor = new Editor();

if (typeof editor === "undefined") {
  loadSpinner();
}

// Load content from IndexedDB when the editor is ready
editor.addEventListener("load", async () => {
  const content = await getDb();
  editor.setValue(content || "");
});

// Save content to IndexedDB when the editor loses focus
editor.addEventListener("blur", async () => {
  const content = editor.getValue();
  await putDb(content);
});

// Check if service workers are supported
if ("serviceWorker" in navigator) {
  // register workbox service worker
  const workboxSW = new Workbox("/src-sw.js");
  workboxSW.register();
} else {
  console.error("Service workers are not supported in this browser.");
}
