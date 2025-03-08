import { createApp } from "vue";
import { Quasar } from "quasar";
import quasarLang from "quasar/lang/ja";
import App from "./App.vue";

createApp(App)
    .use(Quasar, {lang: quasarLang})
    .mount("#app");
