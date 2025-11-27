export type cardType = "video" | "article" | "user" | "live" | "bangumi" | "audio" | "dynamic" | "favorite" | "album";
export type infoType = "views" | "danmakus" | "comments" | "favorites" | "coins" | "likes";
export type themeType = "system" | "light" | "dark";
export type cardInfo<T extends cardType = cardType> = { vid: string; type: T; title: string; author?: string; cover?: string; duration?: string; views?: string; danmakus?: string; comments?: string; favorites?: string; coins?: string; likes?: string; };

export declare interface IBiliBiliCardInfo {
    get views(): string;
    get danmakus(): string;
    get comments(): string;
    get favorites(): string;
    get coins(): string;
    get likes(): string;
}

export declare interface IBiliBiliCard extends IBiliBiliCardInfo {
    contents: {
        link: HTMLAnchorElement;
        cover: HTMLDivElement;
        duration: HTMLDivElement;
        title: HTMLParagraphElement;
        info: HTMLDivElement;
        type: HTMLLabelElement;
        author: HTMLSpanElement;
    };

    get vid(): string | null;
    set vid(value: string);

    get type(): cardType;
    set type(value);

    get title(): string;
    set title(value);

    get author(): string;
    set author(value);

    get cover(): string | undefined;
    set cover(value: string);

    get duration(): string;
    set duration(value);

    get views(): string;
    set views(value);

    get danmakus(): string;
    set danmakus(value);

    get comments(): string;
    set comments(value);

    get favorites(): string;
    set favorites(value);

    get coins(): string;
    set coins(value);

    get likes(): string;
    set likes(value);

    get infoTypes(): infoType[];
    set infoTypes(value: infoType[]);

    get imageProxy(): string;
    set imageProxy(value: string);

    getAttribute(qualifiedName: string): string | null;
    setAttribute(qualifiedName: string, value: string): void;

    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    getInfo(name: infoType): string | null;
}
