/* global hexo */
'use strict';

const { fetch } = require("node-fetch-native")

/**
 * @param {number} num 
 */
function convert(num) {
    return (num >= 1E4) ? `${(num / 1E4).toFixed(1)}万` : num;
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
    return times.map(n => n.toString().padStart(2, 0)).join(":");
}

function createCard(imageProxy, { v_id, v_cover, v_time, v_title, v_playview, v_danmaku, v_upname }) {
    return `<bilibili-card aid="${v_id}" title="${v_title}" upper="${v_upname}" cover="${v_cover}" duration="${v_time}" views="${v_playview}" danmakus="${v_danmaku}" image-proxy="${imageProxy}"></bilibili-card>`
}

/**
 * @param {string} id
 */
async function getVideoMessage(id, log = console) {
    const type = id.slice(0, 2).toLowerCase();
    const vtype = type === "av" ? "aid" : "bvid";
    const url = `http://api.bilibili.com/x/web-interface/view?${vtype}=${type === "bv" ? id : id.slice(2)}`;
    const data = (await (await fetch(url)).json())?.data;
    if (data) {
        return {
            v_id: data.bvid,
            v_title: data.title,
            v_time: toHHMMSS(data.duration),
            v_playview: convert(data.stat?.view),
            v_danmaku: convert(data.stat?.danmaku),
            v_upname: data.owner?.name,
            v_cover: data.pic
        };
    }
    else {
        if (log) {
            log.warn(`Failed to get bilibli video information from ${id}`);
        }
        return {
            v_id: id,
            v_title: "出错了！",
        }
    }
}

module.exports = async (imageProxy, id, log = console) => createCard(imageProxy, await getVideoMessage(id, log));
