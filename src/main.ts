import { createApp } from "vue";
import { Quasar } from "quasar";
import quasarLang from "quasar/lang/ja";
import '@quasar/extras/material-icons/material-icons.css';
import "quasar/dist/quasar.css";
import App from "./App.vue";

createApp(App)
    .use(Quasar, {
        lang: quasarLang,
        plugins: {},
    })
    .mount("#app");
