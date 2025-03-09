<template>
  <main class="container">
    <h1>Tauri + Vue</h1>

    <div class="row">
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo vite" alt="Vite logo" />
      </a>
      <a href="https://tauri.app" target="_blank">
        <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <p>Click on the Tauri, Vite, and Vue logos to learn more.</p>

    <!-- <form class="row" @submit.prevent="greet">
      <input id="greet-input" v-model="name" placeholder="Enter a name..." />
      <q-btn type="submit">Greet</q-btn>
    </form> -->

    <div class="row">
      <input type="file" @change="selectFile" accept="application/pdf,.pdf" />
    </div>

    <div>
      <canvas ref="pdfCanvas"></canvas>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import { invoke } from "@tauri-apps/api/core";
// import { open } from "@tauri-apps/plugin-dialog";
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy, PageViewport } from 'pdfjs-dist';
import workerSrc from "pdfjs-dist/build/pdf.worker?url";

GlobalWorkerOptions.workerSrc = workerSrc;

const pdfCanvas = ref<HTMLCanvasElement | null>(null);

async function loadPdf(filePath: string) {
  const loadingTask = getDocument(filePath);
  const pdfDocument: PDFDocumentProxy = await loadingTask.promise;

  const page: PDFPageProxy = await pdfDocument.getPage(1);
  const scale = 1.5;
  const viewport: PageViewport = page.getViewport({ scale });

  if (pdfCanvas.value) {
    const context = pdfCanvas.value.getContext("2d");
    if (context) {
      pdfCanvas.value.height = viewport.height;
      pdfCanvas.value.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
    }
  }
}

const selectFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const allowedMimeTypes = ["application/pdf"];
  const allowedExtensions = [".pdf"];

  // MIME タイプをチェック（ファイルの種類）
  if (!allowedMimeTypes.includes(file.type)) {
    alert("PDFファイルのみ選択できます。");
    target.value = ""; // 選択をリセット
    return;
  }

  // ファイル名の拡張子チェック
  const fileName = file.name.toLowerCase();
  if (!allowedExtensions.some((ext) => fileName.endsWith(ext))) {
    alert("拡張子が .pdf のファイルのみ選択できます。");
    target.value = ""; // 選択をリセット
    return;
  }

  const fileURL = URL.createObjectURL(file);
  console.log("PDF URL:", fileURL);
  loadPdf(fileURL);
};

</script>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}

</style>
<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.container {
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
}

.logo.tauri:hover {
  filter: drop-shadow(0 0 2em #24c8db);
}

.row {
  display: flex;
  justify-content: center;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

h1 {
  text-align: center;
}

input,
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

#greet-input {
  margin-right: 5px;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }

  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f98;
  }
  button:active {
    background-color: #0f0f0f69;
  }
}

</style>