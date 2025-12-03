/* global hexo */
'use strict';

const bilibiliCardMessage = require("../components/bilibili-card-message/bilibili-card-message");
const bilibiliCardBuilder = require("../components/bilibili-card-builder/bilibili-card-builder");

/**
 * @param {string} imageProxy
 * @param {string[]} args
 * @param {{warn: function(string): void}} log
 */
async function createCardAsync(imageProxy, args, isComponent, log = console) {
    const id = args[0];
    if (!id?.length) { return; }
    const message = await bilibiliCardMessage.getMessageAsync(args[1], id, log);
    if (isComponent) {
        return bilibiliCardBuilder.createHost(imageProxy, args[2], message, args[3]).outerHTML;
    }
    else {
        const card = bilibiliCardBuilder.createCard(imageProxy, args[2], message, args[3]);
        const inner = card.firstChild;
        inner.classList.add("bilibili-card");
        return inner.outerHTML;
    }
}

module.exports = createCardAsync;
