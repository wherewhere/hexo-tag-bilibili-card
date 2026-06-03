/** 卡片类型 */
export type CardType = "video" | "article" | "user" | "live" | "bangumi" | "audio" | "dynamic" | "favorite" | "album";
/** 显示信息类型 */
export type InfoType = "views" | "danmakus" | "comments" | "favorites" | "coins" | "likes";
/** 主题类型 */
export type ThemeType = "system" | "light" | "dark";
/** 卡片信息 */
export type CardInfo = {
    /** 媒体 ID */
    vid: string;
    /** 卡片类型 */
    type: CardType;
    /** 卡片标题 */
    title: string;
    /** 作者 */
    author?: string;
    /** 封面图片地址 */
    cover?: string;
    /** 媒体时长 */
    duration?: string;
    /** 观看量 */
    views?: string;
    /** 弹幕数 */
    danmakus?: string;
    /** 评论数 */
    comments?: string;
    /** 收藏数 */
    favorites?: string;
    /** 投币数 */
    coins?: string;
    /** 点赞数 */
    likes?: string;
};

export declare function canPlay<T extends CardType>(type: T): T extends "video" | "live" | "bangumi" | "audio" ? true : false;
export declare function hasDuration<T extends CardType>(type: T): T extends "video" | "audio" ? true : false;