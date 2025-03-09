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

    <div class="row">
      <input type="file" @change="selectFile" accept="application/pdf" />
    </div>

    <div ref="pdfContainer" class="pdf-container"></div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy, PageViewport } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";

GlobalWorkerOptions.workerSrc = workerSrc;

const pdfContainer = ref<HTMLDivElement | null>(null);

async function loadPdf(file: File) {
  const fileURL = URL.createObjectURL(file);
  const loadingTask = getDocument(fileURL);

  try {
    const pdfDocument: PDFDocumentProxy = await loadingTask.promise;
    pdfContainer.value!.innerHTML = ""; // 前のPDFをクリア

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page: PDFPageProxy = await pdfDocument.getPage(pageNum);
      const scale = 1.5;
      const viewport: PageViewport = page.getViewport({ scale });

      // canvas を作成
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      pdfContainer.value!.appendChild(canvas);

      // PDF ページを描画
      await page.render({ canvasContext: context!, viewport }).promise;
    }
  } catch (error) {
    console.error("PDFの読み込みに失敗しました:", error);
  } finally {
    URL.revokeObjectURL(fileURL); // メモリリーク防止
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

  loadPdf(file);
};
</script>

<style scoped>
.pdf-container {
  width: 100%;
  max-width: 800px;
  margin: auto;
  overflow-y: auto;
  height: 100vh;
  border: 1px solid #ccc;
  padding: 10px;
}
canvas {
  display: block;
  margin-bottom: 100px;
}
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