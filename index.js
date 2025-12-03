/* global hexo */
"use strict";

/** @typedef {import("@types/hexo")} */

const path = require("path");
const createCardAsync = require("./lib/create-card");

function setSettings(obj, set) {
    if (typeof set === "undefined") {
        return;
    }
    else if (set === null) {
        return;
    }
    else if (typeof obj !== "object" || obj instanceof Array) {
        obj = set;
        return;
    }
    const keys = Object.keys(set);
    if (!keys.length) {
        return;
    }
    function setKey(obj, set) {
        if (typeof set === "undefined") {
            return false;
        }
        else if (set === null) {
            return false;
        }
        else if (typeof obj !== "object" || obj instanceof Array) {
            return true;
        }
        const keys = Object.keys(set);
        if (!keys.length) {
            return true;
        }
        keys.forEach(key => {
            if (setKey(obj[key], set[key])) {
                if (typeof set[key] !== "undefined") {
                    obj[key] = set[key];
                }
            }
        });
        return false;
    }
    keys.forEach(key => {
        if (setKey(obj[key], set[key])) {
            if (typeof set[key] !== "undefined") {
                obj[key] = set[key];
            }
        }
    });
}

const bilibili_card = {
    enable: false,
    image_proxy: undefined,
    inject_layouts: ["default"],
    generator_assets: ["default"],
    mode: "system"
};

setSettings(bilibili_card, hexo.config.bilibili_card);

if (!bilibili_card.enable) {
    return;
}

const generator_assets = new Set(bilibili_card.generator_assets);
if (generator_assets.has("component")) {
    generator_assets.delete("component");
    generator_assets.add("components/bilibili-card/bilibili-card.js");
}
if (generator_assets.has("system")) {
    generator_assets.delete("system");
    generator_assets.add("components/bilibili-card/bilibili-card.css");
}
if (generator_assets.has("light")) {
    generator_assets.delete("light");
    generator_assets.add("components/bilibili-card/bilibili-card.light.css");
}
if (generator_assets.has("dark")) {
    generator_assets.delete("dark");
    generator_assets.add("components/bilibili-card/bilibili-card.dark.css");
}
if (generator_assets.has("fluent")) {
    generator_assets.delete("fluent");
    generator_assets.add("components/bilibili-card/bilibili-card.fluent.css");
}
if (generator_assets.has("windose")) {
    generator_assets.delete("windose");
    generator_assets.add("components/bilibili-card/bilibili-card.windose.css");
}
if (generator_assets.has("builder")) {
    generator_assets.delete("builder");
    generator_assets.add("components/bilibili-card-builder/bilibili-card-builder.js");
}
if (generator_assets.has("message")) {
    generator_assets.delete("message");
    generator_assets.add("components/bilibili-card-message/bilibili-card-message.js");
}
generator_assets.delete("default");

const isComponent = bilibili_card.mode == "component";

if (isComponent) {
    generator_assets.add("components/bilibili-card/bilibili-card.js");
    generator_assets.add("components/bilibili-card/bilibili-card.css");
    generator_assets.add("components/bilibili-card/bilibili-card.dark.css");
    generator_assets.add("components/bilibili-card/bilibili-card.light.css");
    const js = hexo.extend.helper.get("js").bind(hexo);
    bilibili_card.inject_layouts.forEach(layout => hexo.extend.injector.register("head_end", () => js("/components/bilibili-card/bilibili-card.js"), layout));
}
else {
    let theme = bilibili_card.mode;
    switch (theme.toString().toLowerCase()) {
        case '1':
        case "light":
            theme = "components/bilibili-card/bilibili-card.light.css";
            break;
        case '2':
        case "dark":
            theme = "components/bilibili-card/bilibili-card.dark.css";
            break;
        case '0':
        case "auto":
        case "system":
        case "default":
            theme = "components/bilibili-card/bilibili-card.css";
            break;
        case "fd":
        case "fd2":
        case "fluent":
        case "fluentui":
            theme = "components/bilibili-card/bilibili-card.fluent.css";
            break;
        case "windose":
            theme = "components/bilibili-card/bilibili-card.windose.css";
            break;
        case "-1":
        case "none":
            theme = '';
            break;
        default:
            break;
    }
    generator_assets.add(theme);
    const css = hexo.extend.helper.get("css").bind(hexo);
    bilibili_card.inject_layouts.forEach(layout => hexo.extend.injector.register("head_end", () => css(path.posix.join('/', theme)), layout));
}

hexo.extend.generator.register("bilibili_card_asset", () => [...generator_assets].map(asset => {
    return {
        path: asset,
        data: () => hexo.render.render({ path: path.resolve(__dirname, asset) })
    }
}));

hexo.extend.tag.register("bilibili_card", args => createCardAsync(bilibili_card.image_proxy, args, isComponent, hexo.log), { async: true });
