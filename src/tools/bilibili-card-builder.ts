import type {
    cardType,
    infoType,
    themeType,
    cardInfo,
    IBiliBiliCard
} from "../helpers/types";

import { initDOM } from "../helpers/node";
const { window, document } = initDOM();

import { polyfill } from "../helpers/polyfill";
polyfill();

import {
    getDefaultInfoTypes,
    defaultTitle,
    defaultAuthor,
    defaultDuration,
    defaultProxy,
    initCard,
    connectedCallback,
    attributeChangedCallback,
    getInfo
} from "../helpers/builder";

function createHost<T extends cardType = "video">(imageProxy: string, infoTypes: string, { vid, type, title, author, cover, duration, views, danmakus, comments, favorites, coins, likes }: cardInfo<T>, theme: themeType) {
    return createHostWithTagName("bilibili-card", imageProxy, infoTypes, { vid, type, title, author, cover, duration, views, danmakus, comments, favorites, coins, likes }, theme);
}

function createHostWithTagName<T extends cardType = "video">(tagName: string, imageProxy: string, infoTypes: string, { vid, type, title, author, cover, duration, views, danmakus, comments, favorites, coins, likes }: cardInfo<T>, theme: themeType) {
    const bilibiliCard = document.createElement(tagName);
    if (vid) {
        bilibiliCard.setAttribute("vid", vid);
    }
    if (type) {
        bilibiliCard.setAttribute("type", type);
    }
    if (title) {
        bilibiliCard.setAttribute("title", title);
    }
    if (author) {
        bilibiliCard.setAttribute("author", author);
    }
    if (cover) {
        bilibiliCard.setAttribute("cover", cover);
    }
    if (duration) {
        bilibiliCard.setAttribute("duration", duration);
    }
    if (views) {
        bilibiliCard.setAttribute("views", views);
    }
    if (danmakus) {
        bilibiliCard.setAttribute("danmakus", danmakus);
    }
    if (comments) {
        bilibiliCard.setAttribute("comments", comments);
    }
    if (favorites) {
        bilibiliCard.setAttribute("favorites", favorites);
    }
    if (coins) {
        bilibiliCard.setAttribute("coins", coins);
    }
    if (likes) {
        bilibiliCard.setAttribute("likes", likes);
    }
    if (infoTypes) {
        bilibiliCard.setAttribute("info-types", infoTypes);
    }
    if (imageProxy) {
        bilibiliCard.setAttribute("image-proxy", imageProxy);
    }
    if (theme) {
        bilibiliCard.setAttribute("theme", theme);
    }
    return bilibiliCard;
}

declare interface BiliBiliCard extends IBiliBiliCard {
    host: Element;
    observer?: MutationObserver;
    attributeChangedCallback(name: string | null, oldValue: string | null, newValue: string | null): void;
}

declare interface BiliBiliCardElement extends Element {
    bilibiliCard: BiliBiliCard;
}

function initHost(host: Element) {
    const bilibiliCard: BiliBiliCard = {
        contents: undefined as any,
        host: host,
        getAttribute(qualifiedName) {
            return this.host.getAttribute(qualifiedName);
        },
        setAttribute(qualifiedName, value) {
            this.host.setAttribute(qualifiedName, value);
        },

        get vid(): string | null {
            return this.getAttribute("vid");
        },
        set vid(value: string) {
            this.setAttribute("vid", value);
        },

        get type(): cardType {
            return this.getAttribute("type") as cardType || "video";
        },
        set type(value) {
            this.setAttribute("type", value);
        },

        get title() {
            return this.getAttribute("title") || defaultTitle;
        },
        set title(value) {
            this.setAttribute("title", value);
        },

        get author() {
            return this.getAttribute("author") || defaultAuthor;
        },
        set author(value) {
            this.setAttribute("author", value);
        },

        get cover(): string | undefined {
            const value = this.getAttribute("cover");
            if (typeof value === "string") {
                return value.trimStart();
            }
        },
        set cover(value: string) {
            this.setAttribute("cover", typeof value === "string" ? value.trimStart() : value);
        },

        get duration() {
            return this.getAttribute("duration") || defaultDuration;
        },
        set duration(value) {
            this.setAttribute("duration", value);
        },

        get views() {
            return this.getAttribute("views") || '0';
        },
        set views(value) {
            this.setAttribute("views", value);
        },

        get danmakus() {
            return this.getAttribute("danmakus") || '0';
        },
        set danmakus(value) {
            this.setAttribute("danmakus", value);
        },

        get comments() {
            return this.getAttribute("comments") || '0';
        },
        set comments(value) {
            this.setAttribute("comments", value);
        },

        get favorites() {
            return this.getAttribute("favorites") || '0';
        },
        set favorites(value) {
            this.setAttribute("favorites", value);
        },

        get coins() {
            return this.getAttribute("coins") || '0';
        },
        set coins(value) {
            this.setAttribute("coins", value);
        },

        get likes() {
            return this.getAttribute("likes") || '0';
        },
        set likes(value) {
            this.setAttribute("likes", value);
        },

        get infoTypes() {
            const value = this.getAttribute("info-types");
            if (typeof value === "string") {
                const types = value.split(/[,|\s+]/).filter(x => x != '');
                if (types.length) {
                    return types as infoType[];
                }
            }
            return getDefaultInfoTypes(this.type);
        },
        set infoTypes(value) {
            this.setAttribute("info-types", Array.isArray(value) ? value.join(' ') : value);
        },

        get imageProxy() {
            return (this.getAttribute("image-proxy") || defaultProxy).trimEnd();
        },
        set imageProxy(value) {
            this.setAttribute("image-proxy", typeof value === "string" ? value.trimEnd() : value);
        },

        connectedCallback() {
            connectedCallback.call(this);
        },

        attributeChangedCallback(name, oldValue, newValue) {
            if (!name || oldValue === newValue) { return; }
            attributeChangedCallback.call(this, name, newValue!);
        },

        getInfo(name) {
            return getInfo.call(this, name);
        }
    }

    const shadowRoot = host;
    initCard.call(bilibiliCard, shadowRoot);
    (host as BiliBiliCardElement).bilibiliCard = bilibiliCard;
    return host as BiliBiliCardElement;
}

function attachHost(host: BiliBiliCardElement) {
    host.bilibiliCard.connectedCallback();
}

function createCard<T extends cardType = "video">(imageProxy: string, infoTypes: string, { vid, type, title, author, cover, duration, views, danmakus, comments, favorites, coins, likes }: cardInfo<T>, theme: themeType) {
    return createCardWithTagName("div", imageProxy, infoTypes, { vid, type, title, author, cover, duration, views, danmakus, comments, favorites, coins, likes }, theme);
}

function createCardWithTagName<T extends cardType = "video">(tagName: string, imageProxy: string, infoTypes: string, { vid, type, title, author, cover, duration, views, danmakus, comments, favorites, coins, likes }: cardInfo<T>, theme: themeType) {
    const bilibiliCard = createHostWithTagName(tagName, imageProxy, infoTypes, { vid, type, title, author, cover, duration, views, danmakus, comments, favorites, coins, likes }, theme);
    praseElement(bilibiliCard);
    return bilibiliCard;
}

function praseElement(element: Element) {
    if (element) {
        attachHost(initHost(element));
    }
}

function registerObserver(element: BiliBiliCardElement) {
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                (mutation.target as BiliBiliCardElement).bilibiliCard.attributeChangedCallback(mutation.attributeName, mutation.oldValue, (mutation.target as HTMLElement).getAttribute(mutation.attributeName!));
            }
        }
    });
    observer.observe(element, { attributes: true, attributeFilter: ["vid", "type", "title", "author", "cover", "duration", "views", "danmakus", "comments", "favorites", "coins", "likes", "info-types", "image-proxy"], attributeOldValue: true });
    element.bilibiliCard.observer = observer;
}

export {
    createHost,
    createHostWithTagName,
    createCard,
    createCardWithTagName,
    praseElement,
    registerObserver,
    window
};
