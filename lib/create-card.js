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
 */
function createCard(imageProxy, { vid, title, author, cover, duration, views, danmakus }) {
    const attributes = ["bilibili-card"];
    if (vid) {
        attributes.push(`vid="${vid}"`);
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
    attributes.push(`views="${views || 0}"`);
    attributes.push(`danmakus="${danmakus || 0}"`);
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
                    title: data.title,
                    author: data.owner?.name,
                    cover: data.pic,
                    duration: toHHMMSS(data.duration),
                    views: convert(data.stat?.view),
                    danmakus: convert(data.stat?.danmaku),
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibli video ${id}`);
                }
                return {
                    vid: id,
                    title: "出错了！"
                }
            }
        case -400:
            warn(token.code, token.message);
            return {
                vid: id,
                title: `出错了！{token.code}`
            };
        case -403:
            warn(token.code, token.message);
            return {
                vid: id,
                title: `权限不足！{token.code}`
            };
        case -404:
            warn(token.code, token.message);
            return {
                vid: id,
                title: `视频不存在！{token.code}`
            };
        case 62002:
            warn(token.code, token.message);
            return {
                vid: id,
                title: `稿件不可见！{token.code}`
            };
        case 62004:
            warn(token.code, token.message);
            return {
                vid: id,
                title: `稿件审核中！{token.code}`
            };
        default:
            warn(token?.code, token?.message);
            return {
                vid: id,
                title: `出错了！{token?.code}`
            };
    }

    /**
     * @param {number} code 
     * @param {string} message 
     */
    function warn(code, message) {
        if (log) {
            log.warn(`Failed to get bilibli video ${id}: ${code} ${message}`);
        }
    }
}

/**
 * @param {string} imageProxy
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
module.exports = async (imageProxy, id, log = console) => getVideoMessage(id, log).then(x => createCard(imageProxy, x));
