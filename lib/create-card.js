/* global hexo */
'use strict';

const bilibiliCardBuilder = require("../components/bilibili-card-builder/bilibili-card-builder.js");

/**
 * @param {number} num 
 */
function formatLargeNumber(num) {
    return (num >= 1E8)
        ? `${(num / 1E8).toFixed(1)}亿`
        : (num >= 1E4)
            ? `${(num / 1E4).toFixed(1)}万`
            : num;
}

/**
 * @param {number} second
 */
function formatSecondsToTime(second) {
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
async function getVideoMessageAsync(id, log = console) {
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
                    duration: formatSecondsToTime(data.duration),
                    views: formatLargeNumber(data.stat?.view),
                    danmakus: formatLargeNumber(data.stat?.danmaku),
                    comments: formatLargeNumber(data.stat?.reply),
                    favorites: formatLargeNumber(data.stat?.favorite),
                    coins: formatLargeNumber(data.stat?.coin),
                    likes: formatLargeNumber(data.stat?.like)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibili video ${id}`);
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
            log.warn(`Failed to get bilibili video ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getArticleMessageAsync(id, log = console) {
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
                    views: formatLargeNumber(data.stat?.view),
                    comments: formatLargeNumber(data.stat?.reply),
                    favorites: formatLargeNumber(data.stat?.favorite),
                    coins: formatLargeNumber(data.stat?.coin),
                    likes: formatLargeNumber(data.stat?.like)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibili article ${id}`);
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
            log.warn(`Failed to get bilibili article ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getUserMessageAsync(id, log = console) {
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
                    views: formatLargeNumber(data.card?.fans),
                    likes: formatLargeNumber(data.like_num)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibili article ${id}`);
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
            log.warn(`Failed to get bilibili user ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getLiveMessageAsync(id, log = console) {
    const url = `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${id}`;
    const token = await fetch(url).then(x => x.json());
    switch (token?.code) {
        case 0:
            const data = token?.data;
            if (data) {
                const user = await getUserMessageAsync(data.uid, log);
                return {
                    vid: data.room_id,
                    type: "live",
                    title: data.title,
                    author: user?.author,
                    cover: data.user_cover,
                    views: formatLargeNumber(data.online)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibili live ${id}`);
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
            log.warn(`Failed to get bilibili live ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getBangumiMessageAsync(id, log = console) {
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
                    log.warn(`Failed to get bilibili article ${id}`);
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
            log.warn(`Failed to get bilibili user ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getAudioMessageAsync(id, log = console) {
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
                    duration: formatSecondsToTime(data.duration),
                    views: formatLargeNumber(data.statistic?.play),
                    comments: formatLargeNumber(data.statistic?.comment),
                    favorites: formatLargeNumber(data.statistic?.collect),
                    coins: formatLargeNumber(data.coin_num)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibili audio ${id}`);
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
            log.warn(`Failed to get bilibili audio ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getDynamicMessageAsync(id, log = console) {
    const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=${id}`;
    const token = await fetch(url).then(x => x.json());
    switch (token?.code) {
        case 0:
            const data = token?.data;
            if (data) {
                const result = {
                    vid: data.card?.desc?.dynamic_id_str,
                    type: "dynamic",
                    author: data.card?.desc?.user_profile?.info?.uname,
                    views: formatLargeNumber(data.card?.desc?.view),
                    comments: formatLargeNumber(data.card?.desc?.comment),
                    likes: formatLargeNumber(data.card?.desc?.like)
                };
                const card = JSON.parse(data.card?.card);
                switch (data.card?.desc?.type) {
                    case 1:
                    case 4:
                        return {
                            ...result,
                            title: card?.item?.content,
                            cover: card?.user?.face,
                        }
                    case 2:
                        return {
                            ...result,
                            title: card?.item?.description,
                            cover: card?.item?.pictures?.[0]?.img_src,
                        };
                    case 8:
                        return {
                            ...result,
                            title: card?.dynamic,
                            cover: card?.pic,
                        }
                    case 64:
                        return {
                            ...result,
                            title: card?.title,
                            cover: card?.image_urls?.[0],
                        }
                    default:
                        return {
                            ...result,
                            title: `${data.card?.desc?.user_profile?.info?.uname} 的动态`,
                            cover: data.card?.desc?.user_profile?.info?.face
                        }
                }
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibili dynamic ${id}`);
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
            log.warn(`Failed to get bilibili dynamic ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getFavoriteMessageAsync(id, log = console) {
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
                    views: formatLargeNumber(data.cnt_info?.play),
                    favorites: formatLargeNumber(data.cnt_info?.collect)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibili favorite ${id}`);
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
            log.warn(`Failed to get bilibili favorite ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
async function getAlbumMessageAsync(id, log = console) {
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
                    views: formatLargeNumber(data.item?.view_count),
                    comments: formatLargeNumber(data.item?.comment_count),
                    favorites: formatLargeNumber(data.item?.collect_count),
                    likes: formatLargeNumber(data.item?.like_count)
                };
            }
            else {
                if (log) {
                    log.warn(`Failed to get bilibili album ${id}`);
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
            log.warn(`Failed to get bilibili album ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

/**
 * @param {string} id
 * @param {{warn: function(string): void}} log
 */
function getMessageAsync(id, log = console) {
    const cvid = id.slice(0, 2).toLowerCase();
    switch (cvid) {
        case "cv":
            return getArticleMessageAsync(id, log);
        case "md":
            return getBangumiMessageAsync(id, log);
        case "au":
            return getAudioMessageAsync(id, log);
        case "bv":
        case "av":
        default:
            return getVideoMessageAsync(id, log);
    }
}

/**
 * @param {string} imageProxy
 * @param {string[]} args
 * @param {{warn: function(string): void}} log
 */
async function createCardAsync(imageProxy, args, isComponent, log = console) {
    const id = args[0];
    if (!id?.length) { return; }
    let message;
    switch (args[1]) {
        case "video":
            message = await getVideoMessageAsync(id, log);
            break;
        case "article":
            message = await getArticleMessageAsync(id, log);
            break;
        case "user":
            message = await getUserMessageAsync(id, log);
            break;
        case "live":
            message = await getLiveMessageAsync(id, log);
            break;
        case "bangumi":
            message = await getBangumiMessageAsync(id, log);
            break;
        case "audio":
            message = await getAudioMessageAsync(id, log);
            break;
        case "dynamic":
            message = await getDynamicMessageAsync(id, log);
            break;
        case "favorite":
            message = await getFavoriteMessageAsync(id, log);
            break;
        case "album":
            message = await getAlbumMessageAsync(id, log);
            break;
        default:
            message = await getMessageAsync(id, log);
    }
    if (isComponent) {
        return bilibiliCardBuilder.createHost(imageProxy, args[2], message, args[3]).outerHTML;
    }
    else {
        const card = bilibiliCardBuilder.createCard(imageProxy, args[2], message, args[3]);
        const inner = card.children[0];
        inner.classList.add("bilibili-card");
        return inner.outerHTML;
    }
}

module.exports = createCardAsync;
