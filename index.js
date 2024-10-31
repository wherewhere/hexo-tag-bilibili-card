/* global hexo */
"use strict";

if (typeof hexo !== "undefined") {
    const fs = require("hexo-fs");
    const path = require("path");
    const createCardAsync = require("./lib/create-card.js");

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
        enable: true,
        image_proxy: undefined,
        inject_layouts: ["default"],
        mode: "system"
    };

    setSettings(bilibili_card, hexo.config.bilibili_card);

    if (!bilibili_card?.enable) {
        return;
    }

    const isComponent = bilibili_card?.mode == "component";

    hexo.extend.generator.register("bilibili_card_asset", () => isComponent
        ? [{
            path: "components/bilibili-card/bilibili-card.js",
            data: () => fs.createReadStream(path.resolve(__dirname, "./components/bilibili-card", "bilibili-card.js"))
        },
        {
            path: "components/bilibili-card/bilibili-card.css",
            data: () => fs.createReadStream(path.resolve(__dirname, "./components/bilibili-card", "bilibili-card.css"))
        },
        {
            path: "components/bilibili-card/bilibili-card.dark.css",
            data: () => fs.createReadStream(path.resolve(__dirname, "./components/bilibili-card", "bilibili-card.dark.css"))
        },
        {
            path: "components/bilibili-card/bilibili-card.light.css",
            data: () => fs.createReadStream(path.resolve(__dirname, "./components/bilibili-card", "bilibili-card.light.css"))
        }]
        : [{
            path: "css/bilibili-card.css",
            data: () => fs.createReadStream(path.resolve(__dirname, (() => {
                const baseUrl = "./components/bilibili-card/bilibili-card";
                switch (bilibili_card.mode.toString().toLowerCase()) {
                    case '1':
                    case "light":
                        return `${baseUrl}.light.css`;
                    case '2':
                    case "dark":
                        return `${baseUrl}.dark.css`;
                    case '0':
                    case "auto":
                    case "system":
                    case "default":
                        return `${baseUrl}.css`;
                    case "fd":
                    case "fd2":
                    case "fluent":
                    case "fluentui":
                        return `${baseUrl}.fluent.css`;
                    case "windose":
                        return `${baseUrl}.windose.css`;
                    case "-1":
                    case "none":
                        return '';
                    default:
                        return theme;
                }
            })()))
        }]
    );

    hexo.extend.tag.register("bilibili_card", args => createCardAsync(bilibili_card.image_proxy, args, isComponent, hexo.log), { async: true });

    if (isComponent) {
        const js = hexo.extend.helper.get("js").bind(hexo);
        bilibili_card.inject_layouts.forEach(layout => hexo.extend.injector.register("head_end", () => js("/components/bilibili-card/bilibili-card.js"), layout));
    }
    else {
        const css = hexo.extend.helper.get("css").bind(hexo);
        bilibili_card.inject_layouts.forEach(layout => hexo.extend.injector.register("head_end", () => css("/css/bilibili-card.css"), layout));
    }
}
else {
    module.exports = {
        BiliBiliCard: require("./components/bilibili-card/bilibili-card.js"),
        bilibiliCardMessage: require("./components/bilibili-card-message/bilibili-card-message.js"),
        bilibiliCardBuilder: require("./components/bilibili-card-builder/bilibili-card-builder.js"),
    }
}