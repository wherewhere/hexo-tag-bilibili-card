/* global hexo */
"use strict";

const fs = require("hexo-fs");
const path = require("path");
const createCard = require("./lib/create-card.js");
const js = hexo.extend.helper.get("js").bind(hexo);

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
    inject_layouts: ["default"]
};

setSettings(bilibili_card, hexo.config.bilibili_card);

if (!bilibili_card?.enable) {
    return;
}

hexo.extend.generator.register("bilibili_card_asset", () => [
    {
        path: "components/bilibili-card/bilibili-card.js",
        data: () => fs.createReadStream(path.resolve(__dirname, "./components/bilibili-card", "bilibili-card.js"))
    },
    {
        path: "components/bilibili-card/bilibili-card.css",
        data: () => fs.createReadStream(path.resolve(__dirname, "./components/bilibili-card", "bilibili-card.css"))
    }
]);

hexo.extend.tag.register("bilibili_card", args => createCard(bilibili_card.image_proxy, args, hexo.log), { async: true });

bilibili_card.inject_layouts.forEach(layout => hexo.extend.injector.register("head_begin", () => js("/components/bilibili-card/bilibili-card.js"), layout));
