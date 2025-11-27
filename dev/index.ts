import {
    provideFluentDesignSystem,
    fluentTextArea,
    baseLayerLuminance,
    StandardLuminance
} from "@fluentui/web-components";
provideFluentDesignSystem().register(fluentTextArea());

import { isDarkTheme } from "color-scheme-checker/src/theme";
import { registerColorSchemeListener } from "color-scheme-checker/src/monitor";

function applyTheme(isDark: boolean) {
    baseLayerLuminance.withDefault(isDark ? StandardLuminance.DarkMode : StandardLuminance.LightMode);
}
applyTheme(isDarkTheme());
registerColorSchemeListener(applyTheme);

import { createApp } from "vue";
import { createHead } from "@unhead/vue/client";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).use(createHead()).mount("#vue-app");

import "../src/components/bilibili-card";