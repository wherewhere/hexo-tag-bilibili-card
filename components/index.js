/// <reference types="@types/systemjs" />
/// <reference path="./types/requirejs.ts" />
/** @typedef {import("./bilibili-card/bilibili-card.js").BiliBiliCard} BiliBiliCard */
/** @typedef {import("./bilibili-card-builder/bilibili-card-builder.js")} bilibiliCardBuilder */
/** @typedef {import("./bilibili-card-message/bilibili-card-message.js")} bilibiliCardMessage */
const bilibiliCardURL = "./bilibili-card/bilibili-card.js";
const bilibiliCardBuilderURL = "./bilibili-card-builder/bilibili-card-builder.js";
const bilibiliCardMessageURL = "./bilibili-card-message/bilibili-card-message.js";
if (typeof require === "function" && typeof module === "object" && module.exports) {
    module.exports = {
        /** @type {BiliBiliCard} */
        BiliBiliCard: require(bilibiliCardURL),
        /** @type {bilibiliCardBuilder} */
        bilibiliCardBuilder: require(bilibiliCardBuilderURL),
        /** @type {bilibiliCardMessage} */
        bilibiliCardMessage: require(bilibiliCardMessageURL)
    };
}
else {
    if (typeof System === "object" && typeof System.register === "function") {
        System.register([
            bilibiliCardURL,
            bilibiliCardBuilderURL,
            bilibiliCardMessageURL
        ], function (_export) {
            /** @type {BiliBiliCard} */
            let BiliBiliCard,
                /** @type {bilibiliCardBuilder} */
                bilibiliCardBuilder,
                /** @type {bilibiliCardMessage} */
                bilibiliCardMessage;
            return {
                setters: [
                    function (/** @type {BiliBiliCard} */ module) {
                        BiliBiliCard = module;
                    },
                    function (/** @type {bilibiliCardBuilder} */ module) {
                        bilibiliCardBuilder = module;
                    },
                    function (/** @type {bilibiliCardMessage} */ module) {
                        bilibiliCardMessage = module;
                    }
                ],
                execute() {
                    _export({ BiliBiliCard, bilibiliCardBuilder, bilibiliCardMessage });
                }
            }
        });
    }
    if (typeof define === "function" && define.amd) {
        define([
            bilibiliCardURL,
            bilibiliCardBuilderURL,
            bilibiliCardMessageURL
        ], function (
            /** @type {BiliBiliCard} */ BiliBiliCard,
            /** @type {bilibiliCardBuilder} */ bilibiliCardBuilder,
            /** @type {bilibiliCardMessage} */ bilibiliCardMessage) {
            return { BiliBiliCard, bilibiliCardBuilder, bilibiliCardMessage };
        });
    }
}