/* global hexo */
'use strict';

/**
 * @param {number} num 
 */
function convert(num) {
    return (num >= 1E8)
        ? `${(num / 1E8).toFixed(1)}亿`
        : (num >= 1E4)
            ? `${(num / 1E4).toFixed(1)}万`
            : num;
}

/**
 * @param {number} second
 */
function toHHMMSS(second) {
    const sec = second % 60;
    const min = Math.floor(second / 60) % 60;
    const hour = Math.floor(second / 3600);
    /** @type {number[]} */
    const times = [];
    if (hour) {
        times.push(hour);
    }
    times.push(min);
    times.push(sec);
    return times.map(n => n.toString().padStart(2, 0)).join(':');
}

/**
 * @param {string} imageProxy
 * @param {string} infoTypes
 * @param {{vid: string, title: string, author: string, cover: string, duration: string, views: string | number, danmakus: string | number}}
 */
function createElement(imageProxy, infoTypes, { vid, type, title, author, cover, duration, views, danmakus, comments, favorites, coins, likes }) {
    const attributes = ["bilibili-card"];
    if (vid) {
        attributes.push(`vid="${vid}"`);
    }
    if (type) {
        attributes.push(`type="${type}"`);
    }
    if (title) {
        attributes.push(`title="${title}"`);
    }
    if (author) {
        attributes.push(`author="${author}"`);
    }
    if (cover) {
        attributes.push(`cover="${cover}"`);
    }
    if (duration) {
        attributes.push(`duration="${duration}"`);
    }
    if (views) {
        attributes.push(`views="${views}"`);
    }
    if (danmakus) {
        attributes.push(`danmakus="${danmakus}"`);
    }
    if (comments) {
        attributes.push(`comments="${comments}"`);
    }
    if (favorites) {
        attributes.push(`favorites="${favorites}"`);
    }
    if (coins) {
        attributes.push(`coins="${coins}"`);
    }
    if (likes) {
        attributes.push(`likes="${likes}"`);
    }
    if (infoTypes) {
        attributes.push(`info-types="${infoTypes}"`);
    }
    if (imageProxy) {
        attributes.push(`image-proxy="${imageProxy}"`);
    }
    return `<${attributes.join(' ')}></bilibili-card>`;
}

/**
 * @param {string} id 
 */
function getVid(id) {
    const type = id.slice(0, 2).toUpperCase();
    if (type === "BV") {
        return { id: id, type: "bvid" };
    }
    else if (type === "AV") {
        return { id: id.slice(2), type: "aid" };
    }
    else {
        const num = Number(id);
        if (isNaN(num)) {
            return { id: `BV${id}`, type: "bvid" };
        }
        else {
            return { id: num, type: "aid" };
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getVideoMessage(id, log = console) {
    const vid = getVid(id);
    const url = `https://api.bilibili.com/x/web-interface/view?${vid.type}=${vid.id}`;
    const token = await fetch(url).then(x => x.json());
    switch (token?.code) {
        case 0:
            const data = token?.data;
            if (data) {
                return {
                    vid: data.bvid,
                    type: "video",
                    title: data.title,
                    author: data.owner?.name,
                    cover: data.pic,
                    duration: toHHMMSS(data.duration),
                    views: convert(data.stat?.view),
                    danmakus: convert(data.stat?.danmaku),
                    comments: convert(data.stat?.reply),
                    favorites: convert(data.stat?.favorite),
                    coins: convert(data.stat?.coin),
                    likes: convert(data.stat?.like)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibli video ${id}`);
                }
                return {
                    vid: id,
                    type: "video",
                    title: "出错了！"
                }
            }
        case -400:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "video",
                title: `出错了！${token.code}`
            };
        case -403:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "video",
                title: `权限不足！${token.code}`
            };
        case -404:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "video",
                title: `视频不存在！${token.code}`
            };
        case 62002:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "video",
                title: `稿件不可见！${token.code}`
            };
        case 62004:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "video",
                title: `稿件审核中！${token.code}`
            };
        default:
            warn(token?.code, token?.message);
            return {
                vid: id,
                type: "video",
                title: `出错了！${token?.code}`
            };
    }

    /**
     * @param {number} code 
     * @param {string} message 
     */
    function warn(code, message) {
        if (log) {
            log.warn(`Failed to get bilibli video ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getArticleMessage(id, log = console) {
    const cvid = id.slice(0, 2).toLowerCase() === "cv" ? id.slice(2) : id;
    const url = `https://api.bilibili.com/x/article/viewinfo?id=${cvid}`;
    const token = await fetch(url).then(x => x.json());
    switch (token?.code) {
        case 0:
            const data = token?.data;
            if (data) {
                return {
                    vid: id,
                    type: "article",
                    title: data.title,
                    author: data.author_name,
                    cover: data.banner_url,
                    views: convert(data.stat?.view),
                    comments: convert(data.stat?.reply),
                    favorites: convert(data.stat?.favorite),
                    coins: convert(data.stat?.coin),
                    likes: convert(data.stat?.like)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibli article ${id}`);
                }
                return {
                    vid: id,
                    type: "article",
                    title: "出错了！"
                }
            }
        case -400:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "article",
                title: `出错了！${token.code}`
            };
        case -404:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "article",
                title: `专栏不存在！${token.code}`
            };
        default:
            warn(token?.code, token?.message);
            return {
                vid: id,
                type: "article",
                title: `出错了！${token?.code}`
            };
    }

    /**
     * @param {number} code 
     * @param {string} message 
     */
    function warn(code, message) {
        if (log) {
            log.warn(`Failed to get bilibli article ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

function getMessage(id, log = console) {
    const cvid = id.slice(0, 2).toUpperCase();
    switch (cvid) {
        case "CV":
            return getArticleMessage(id, log);
        case "BV":
        case "AV":
        default:
            return getVideoMessage(id, log);
    }
}

/**
 * @param {string} imageProxy
 * @param {string[]} args
 * @param {{warn: function(string): void}} log
 */
async function createCard(imageProxy, args, log = console) {
    const id = args[0];
    let message;
    switch (args[1]) {
        case "video":
            message = await getVideoMessage(id, log);
            break;
        case "article":
            message = await getArticleMessage(id, log);
            break;
        default:
            message = await getMessage(id, log);
    }
    return createElement(imageProxy, args[2], message);
}

module.exports = createCard;
