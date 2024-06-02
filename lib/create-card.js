/* global hexo */
'use strict';

/**
 * @param {number} num 
 */
function convert(num) {
    return (num >= 1E8)
        ? `${(num / 1E4).toFixed(1)}亿`
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
    const data = await fetch(url).then(x => x.json()).then(x => x?.data);
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
            log.warn(`Failed to get bilibli video information from ${id}`);
        }
        return {
            vid: id,
            title: "出错了！"
        }
    }
}

/**
 * @param {string} imageProxy
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
module.exports = async (imageProxy, id, log = console) => getVideoMessage(id, log).then(x => createCard(imageProxy, x));
