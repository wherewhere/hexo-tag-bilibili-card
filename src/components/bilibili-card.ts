import type {
    cardType,
    infoType,
    themeType,
    IBiliBiliCard
} from "../helpers/types";

import "../helpers/polyfill";

import {
    getDefaultInfoTypes,
    defaultTitle,
    defaultAuthor,
    defaultDuration,
    defaultTheme,
    defaultProxy,
    initCard,
    connectedCallback,
    attributeChangedCallback,
    getInfo
} from "../helpers/builder";

import { getTheme } from "../helpers/theme";

export default class BiliBiliCard extends HTMLElement implements IBiliBiliCard {
    declare isLoaded: boolean;
    declare contents: {
        link: HTMLAnchorElement;
        cover: HTMLDivElement;
        duration: HTMLDivElement;
        title: HTMLParagraphElement;
        info: HTMLDivElement;
        type: HTMLLabelElement;
        author: HTMLSpanElement;
        theme: HTMLLinkElement;
    };

    static get observedAttributes() {
        return ["vid", "type", "title", "author", "cover", "duration", "views", "danmakus", "comments", "favorites", "coins", "likes", "info-types", "image-proxy", "theme"];
    }

    constructor() {
        super();

        this.isLoaded = false;
        const shadowRoot = this.attachShadow({ mode: "open" });

        const theme = document.createElement("link");
        theme.rel = "stylesheet";
        shadowRoot.appendChild(theme);

        initCard.apply(this, [shadowRoot]);

        this.contents.theme = theme;
    }

    get vid(): string | null {
        return this.getAttribute("vid");
    }
    set vid(value: string) {
        this.setAttribute("vid", value);
    }

    get type(): cardType {
        return this.getAttribute("type") as cardType || "video";
    }
    set type(value) {
        this.setAttribute("type", value);
    }

    get title() {
        return this.getAttribute("title") || defaultTitle;
    }
    set title(value) {
        this.setAttribute("title", value);
    }

    get author() {
        return this.getAttribute("author") || defaultAuthor;
    }
    set author(value) {
        this.setAttribute("author", value);
    }

    get cover(): string | undefined {
        const value = this.getAttribute("cover");
        if (typeof value === "string") {
            return value.trimStart();
        }
    }
    set cover(value: string) {
        this.setAttribute("cover", typeof value === "string" ? value.trimStart() : value);
    }

    get duration() {
        return this.getAttribute("duration") || defaultDuration;
    }
    set duration(value) {
        this.setAttribute("duration", value);
    }

    get views() {
        return this.getAttribute("views") || '0';
    }
    set views(value) {
        this.setAttribute("views", value);
    }

    get danmakus() {
        return this.getAttribute("danmakus") || '0';
    }
    set danmakus(value) {
        this.setAttribute("danmakus", value);
    }

    get comments() {
        return this.getAttribute("comments") || '0';
    }
    set comments(value) {
        this.setAttribute("comments", value);
    }

    get favorites() {
        return this.getAttribute("favorites") || '0';
    }
    set favorites(value) {
        this.setAttribute("favorites", value);
    }

    get coins() {
        return this.getAttribute("coins") || '0';
    }
    set coins(value) {
        this.setAttribute("coins", value);
    }

    get likes() {
        return this.getAttribute("likes") || '0';
    }
    set likes(value) {
        this.setAttribute("likes", value);
    }

    get infoTypes() {
        const value = this.getAttribute("info-types");
        if (typeof value === "string") {
            const types = value.split(/[,|\s+]/).filter(x => x != '');
            if (types.length) {
                return types as infoType[];
            }
        }
        return getDefaultInfoTypes(this.type);
    }
    set infoTypes(value) {
        this.setAttribute("info-types", Array.isArray(value) ? value.join(' ') : value);
    }

    get imageProxy() {
        return (this.getAttribute("image-proxy") || defaultProxy).trimEnd();
    }
    set imageProxy(value) {
        this.setAttribute("image-proxy", typeof value === "string" ? value.trimEnd() : value);
    }

    get theme() {
        return this.getAttribute("theme") as themeType || defaultTheme;
    }
    set theme(value) {
        this.setAttribute("theme", value);
    }

    connectedCallback() {
        this.contents.theme.href = getTheme(this.theme);
        connectedCallback.apply(this);
        this.isLoaded = true;
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (!this.isLoaded || oldValue === newValue) { return; }
        if (name === "theme") {
            this.contents.theme.href = getTheme(newValue as themeType || defaultTheme);
        }
        else {
            attributeChangedCallback.apply(this, [name, newValue]);
        }
    }

    getInfo(name: infoType) {
        return getInfo.apply(this, [name]);
    }
}

customElements.define("bilibili-card", BiliBiliCard);