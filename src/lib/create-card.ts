/* global hexo */
"use strict";

import type { cardType, themeType } from "../helpers/types";
import * as bilibiliCardMessage from "../tools/bilibili-card-message";
import * as bilibiliCardBuilder from "../tools/bilibili-card-builder";

export async function createCardAsync(imageProxy: string, args: string[], isComponent: boolean, log: { warn: (arg0: string) => void; } = console) {
    const id = args[0];
    if (!id?.length) { return; }
    const message = await bilibiliCardMessage.getMessageAsync(args[1] as cardType, id, log);
    if (isComponent) {
        return bilibiliCardBuilder.createHost(imageProxy, args[2], message, args[3] as themeType).outerHTML;
    }
    else {
        const card = bilibiliCardBuilder.createCard(imageProxy, args[2], message, args[3] as themeType);
        const inner = card.firstChild as HTMLElement | null;
        if (!inner) { return; }
        inner.classList.add("bilibili-card");
        return inner.outerHTML;
    }
}
