import type { themeType } from "../helpers/types";

import bilibiliCard from "../components/bilibili-card.css.ts";
import lightTheme from "../components/bilibili-card.light.css.ts";
import darkTheme from "../components/bilibili-card.dark.css.ts";
import fluentTheme from "../components/bilibili-card.fluent.css.ts";
import windoseTheme from "../components/bilibili-card.windose.css.ts";

export function getTheme(theme: themeType) {
    switch (theme.toLowerCase()) {
        case '1':
        case "light":
            return lightTheme;
        case '2':
        case "dark":
            return darkTheme;
        case '0':
        case "auto":
        case "system":
        case "default":
            return bilibiliCard;
        case "fd":
        case "fd2":
        case "fluent":
        case "fluentui":
            return fluentTheme;
        case "windose":
            return windoseTheme;
        case "-1":
        case "none":
            return '';
        default:
            return theme;
    }
}