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

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getUserMessage(id, log = console) {
    const url = `https://api.bilibili.com/x/web-interface/card?mid=${id}`;
    const token = await fetch(url).then(x => x.json());
    switch (token?.code) {
        case 0:
            const data = token?.data;
            if (data) {
                return {
                    vid: data.card?.mid,
                    type: "user",
                    title: `${data.card?.name}\n${data.card?.sign}`,
                    author: data.card?.name,
                    cover: data.card?.face,
                    views: convert(data.card?.fans),
                    likes: convert(data.like_num)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibli article ${id}`);
                }
                return {
                    vid: id,
                    type: "user",
                    title: "出错了！"
                }
            }
        case -400:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "user",
                title: `出错了！${token.code}`
            };
        default:
            warn(token?.code, token?.message);
            return {
                vid: id,
                type: "user",
                title: `出错了！${token?.code}`
            };
    }

    /**
     * @param {number} code 
     * @param {string} message 
     */
    function warn(code, message) {
        if (log) {
            log.warn(`Failed to get bilibli user ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getLiveMessage(id, log = console) {
    const url = `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${id}`;
    const token = await fetch(url).then(x => x.json());
    switch (token?.code) {
        case 0:
            const data = token?.data;
            if (data) {
                const user = await getUserMessage(data.uid, log);
                return {
                    vid: data.room_id,
                    type: "live",
                    title: data.title,
                    author: user?.author,
                    cover: data.user_cover,
                    views: convert(data.online)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibli live ${id}`);
                }
                return {
                    vid: id,
                    type: "live",
                    title: "出错了！"
                }
            }
        case 1:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "live",
                title: `房间不存在！${token.code}`
            };
        default:
            warn(token?.code, token?.message);
            return {
                vid: id,
                type: "live",
                title: `出错了！${token?.code}`
            };
    }

    /**
     * @param {number} code 
     * @param {string} message 
     */
    function warn(code, message) {
        if (log) {
            log.warn(`Failed to get bilibli live ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getBangumiMessage(id, log = console) {
    const mdid = id.slice(0, 2).toLowerCase() === "md" ? id.slice(2) : id;
    const url = `https://api.bilibili.com/pgc/review/user?media_id=${mdid}`;
    const token = await fetch(url).then(x => x.json());
    switch (token?.code) {
        case 0:
            const data = token?.result;
            if (data) {
                return {
                    vid: data.media?.media_id,
                    type: "bangumi",
                    title: data.media?.title,
                    author: data.media?.type_name,
                    cover: data.media?.horizontal_picture,
                    favorites: data.media?.rating?.score
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibli article ${id}`);
                }
                return {
                    vid: id,
                    type: "bangumi",
                    title: "出错了！"
                }
            }
        case -400:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "bangumi",
                title: `出错了！${token.code}`
            };
        case -404:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "bangumi",
                title: `番剧不存在！${token.code}`
            };
        default:
            warn(token?.code, token?.message);
            return {
                vid: id,
                type: "bangumi",
                title: `出错了！${token?.code}`
            };
    }

    /**
     * @param {number} code 
     * @param {string} message 
     */
    function warn(code, message) {
        if (log) {
            log.warn(`Failed to get bilibli user ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getAudioMessage(id, log = console) {
    const auid = id.slice(0, 2).toLowerCase() === "au" ? id.slice(2) : id;
    const url = `https://api.bilibili.com/audio/music-service-c/web/song/info?sid=${auid}`;
    const token = await fetch(url).then(x => x.json());
    switch (token?.code) {
        case 0:
            const data = token?.data;
            if (data) {
                return {
                    vid: data.id,
                    type: "audio",
                    title: data.title,
                    author: data.author,
                    cover: data.cover,
                    duration: toHHMMSS(data.duration),
                    views: convert(data.statistic?.play),
                    comments: convert(data.statistic?.comment),
                    favorites: convert(data.statistic?.collect),
                    coins: convert(data.coin_num)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibli audio ${id}`);
                }
                return {
                    vid: id,
                    type: "audio",
                    title: "出错了！"
                }
            }
        default:
            warn(token?.code, token?.message);
            return {
                vid: id,
                type: "audio",
                title: `出错了！${token?.code}`
            };
    }

    /**
     * @param {number} code 
     * @param {string} message 
     */
    function warn(code, message) {
        if (log) {
            log.warn(`Failed to get bilibli audio ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getDynamicMessage(id, log = console) {
    const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=${id}`;
    const token = await fetch(url).then(x => x.json());
    switch (token?.code) {
        case 0:
            const data = token?.data;
            if (data) {
                const card = JSON.parse(data.card?.card);
                return {
                    vid: data.card?.desc?.dynamic_id,
                    type: "dynamic",
                    title: card?.item?.description,
                    author: data.card?.desc?.user_profile?.info?.uname,
                    cover: card?.item?.pictures[0]?.img_src,
                    views: convert(data.card?.desc?.view),
                    comments: convert(data.card?.desc?.comment),
                    likes: convert(data.card?.desc?.like)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibli dynamic ${id}`);
                }
                return {
                    vid: id,
                    type: "dynamic",
                    title: "出错了！"
                }
            }
        default:
            warn(token?.code, token?.message);
            return {
                vid: id,
                type: "dynamic",
                title: `出错了！${token?.code}`
            };
    }

    /**
     * @param {number} code 
     * @param {string} message 
     */
    function warn(code, message) {
        if (log) {
            log.warn(`Failed to get bilibli dynamic ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getFavoriteMessage(id, log = console) {
    const url = `https://api.bilibili.com/x/v3/fav/folder/info?media_id=${id}`;
    const token = await fetch(url).then(x => x.json());
    switch (token?.code) {
        case 0:
            const data = token?.data;
            if (data) {
                return {
                    vid: data.id,
                    type: "favorite",
                    title: data.title,
                    author: data.upper?.name,
                    cover: data.cover,
                    views: convert(data.cnt_info?.play),
                    favorites: convert(data.cnt_info?.collect)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibli favorite ${id}`);
                }
                return {
                    vid: id,
                    type: "favorite",
                    title: "出错了！"
                }
            }
        case -400:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "favorite",
                title: `出错了！${token.code}`
            };
        case -403:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "favorite",
                title: `权限不足！${token.code}`
            };
        default:
            warn(token?.code, token?.message);
            return {
                vid: id,
                type: "favorite",
                title: `出错了！${token?.code}`
            };
    }

    /**
     * @param {number} code 
     * @param {string} message 
     */
    function warn(code, message) {
        if (log) {
            log.warn(`Failed to get bilibli favorite ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getAlbumMessage(id, log = console) {
    const url = `https://api.vc.bilibili.com/link_draw/v1/doc/detail?doc_id=${id}`;
    const token = await fetch(url).then(x => x.json());
    switch (token?.code) {
        case 0:
            const data = token?.data;
            if (data) {
                return {
                    vid: data.item?.doc_id,
                    type: "album",
                    title: data.item?.title,
                    author: data.user?.name,
                    cover: data.item?.pictures[0]?.img_src,
                    views: convert(data.item?.view_count),
                    comments: convert(data.item?.comment_count),
                    favorites: convert(data.item?.collect_count),
                    likes: convert(data.item?.like_count)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibli album ${id}`);
                }
                return {
                    vid: id,
                    type: "album",
                    title: "出错了！"
                }
            }
        case 110001:
            warn(token.code, token.message);
            return {
                vid: id,
                type: "album",
                title: `相册不存在！${token.code}`
            };
        default:
            warn(token?.code, token?.message);
            return {
                vid: id,
                type: "album",
                title: `出错了！${token?.code}`
            };
    }

    /**
     * @param {number} code 
     * @param {string} message 
     */
    function warn(code, message) {
        if (log) {
            log.warn(`Failed to get bilibli album ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

function getMessage(id, log = console) {
    const cvid = id.slice(0, 2).toUpperCase();
    switch (cvid) {
        case "CV":
            return getArticleMessage(id, log);
        case "MD":
            return getBangumiMessage(id, log);
        case "AU":
            return getAudioMessage(id, log);
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
    if (!id?.length) { return; }
    let message;
    switch (args[1]) {
        case "video":
            message = await getVideoMessage(id, log);
            break;
        case "article":
            message = await getArticleMessage(id, log);
            break;
        case "user":
            message = await getUserMessage(id, log);
            break;
        case "live":
            message = await getLiveMessage(id, log);
            break;
        case "bangumi":
            message = await getBangumiMessage(id, log);
            break;
        case "audio":
            message = await getAudioMessage(id, log);
            break;
        case "dynamic":
            message = await getDynamicMessage(id, log);
            break;
        case "favorite":
            message = await getFavoriteMessage(id, log);
            break;
        case "album":
            message = await getAlbumMessage(id, log);
            break;
        default:
            message = await getMessage(id, log);
    }
    return createElement(imageProxy, args[2], message);
}

module.exports = createCard;
