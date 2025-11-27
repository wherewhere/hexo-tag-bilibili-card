import type { cardInfo, cardType } from "../helpers/types";

function formatLargeNumber(num: number): string {
    return (num >= 1E8)
        ? `${(num / 1E8).toFixed(1)}亿`
        : (num >= 1E4)
            ? `${(num / 1E4).toFixed(1)}万`
            : num as any;
}

function formatSecondsToTime(second: number) {
    const sec = second % 60;
    const min = Math.floor(second / 60) % 60;
    const hour = Math.floor(second / 3600);
    const times = [];
    if (hour) {
        times.push(hour);
    }
    times.push(min);
    times.push(sec);
    return times.map(n => n.toString().padStart(2, '0')).join(':');
}

function getVid(id: string) {
    const type = id?.slice(0, 2).toUpperCase();
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

function getApi(id: string, type: cardType) {
    switch (type) {
        case "video":
            const vid = getVid(id);
            return `https://api.bilibili.com/x/web-interface/view?${vid.type}=${vid.id}`;
        case "article":
            const cvid = id.slice(0, 2).toLowerCase() === "cv" ? id.slice(2) : id;
            return `https://api.bilibili.com/x/article/viewinfo?id=${cvid}`;
        case "user":
            return `https://api.bilibili.com/x/web-interface/card?mid=${id}`;
        case "live":
            return `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${id}`;
        case "bangumi":
            const mdid = id.slice(0, 2).toLowerCase() === "md" ? id.slice(2) : id;
            return `https://api.bilibili.com/pgc/review/user?media_id=${mdid}`;
        case "audio":
            const auid = id.slice(0, 2).toLowerCase() === "au" ? id.slice(2) : id;
            return `https://api.bilibili.com/audio/music-service-c/web/song/info?sid=${auid}`;
        case "dynamic":
            return `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=${id}`;
        case "favorite":
            return `https://api.bilibili.com/x/v3/fav/folder/info?media_id=${id}`;
        case "album":
            return `https://api.vc.bilibili.com/link_draw/v1/doc/detail?doc_id=${id}`;
        default:
            const code = id?.slice(0, 2).toLowerCase();
            switch (code) {
                case "cv":
                    return getApi(id, "article");
                case "md":
                    return getApi(id, "bangumi");
                case "au":
                    return getApi(id, "audio");
                case "bv":
                case "av":
                default:
                    return getApi(id, "video");
            }
    }
}

function getVideoMessage(id: string, token: any, log: { warn: (data: string) => void; } = console): cardInfo<"video"> {
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

    function warn(code: number, message: string) {
        if (log) {
            log.warn(`Failed to get bilibili video ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

function getArticleMessage(id: string, token: any, log: { warn: (data: string) => void; } = console): cardInfo<"article"> {
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

    function warn(code: number, message: string) {
        if (log) {
            log.warn(`Failed to get bilibili article ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

function getUserMessage(id: string, token: any, log: { warn: (data: string) => void; } = console): cardInfo<"user"> {
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

    function warn(code: number, message: string) {
        if (log) {
            log.warn(`Failed to get bilibili user ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

function getLiveMessage<T extends ((id: string, console: { warn: (data: string) => void; }) => Promise<cardInfo<"user">>) | undefined>(id: string, token: any, getUser: T, log: { warn: (data: string) => void; } = console): (T extends undefined
    ? cardInfo<"live">
    : Promise<cardInfo<"live">>) | {
        vid: string;
        type: "live";
        title: string;
    } {
    switch (token?.code) {
        case 0:
            const data = token?.data;
            if (data) {
                const result = {
                    vid: data.room_id,
                    type: "live" as "live",
                    title: data.title,
                    cover: data.user_cover,
                    views: formatLargeNumber(data.online)
                };
                if (getUser) {
                    return getUser(data.uid, log).then(user => {
                        return {
                            ...result,
                            author: user?.author,
                        }
                    }) as any;
                }
                else {
                    return result;
                }
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

    function warn(code: number, message: string) {
        if (log) {
            log.warn(`Failed to get bilibili live ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

function getBangumiMessage(id: string, token: any, log: { warn: (data: string) => void; } = console): cardInfo<"bangumi"> {
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

    function warn(code: number, message: string) {
        if (log) {
            log.warn(`Failed to get bilibili user ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

function getAudioMessage(id: string, token: any, log: { warn: (data: string) => void; } = console): cardInfo<"audio"> {
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

    function warn(code: number, message: string) {
        if (log) {
            log.warn(`Failed to get bilibili audio ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

function getDynamicMessage(id: string, token: any, log: { warn: (data: string) => void; } = console): cardInfo<"dynamic"> {
    switch (token?.code) {
        case 0:
            const data = token?.data;
            if (data) {
                const result = {
                    vid: data.card?.desc?.dynamic_id_str,
                    type: "dynamic" as "dynamic",
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

    function warn(code: number, message: string) {
        if (log) {
            log.warn(`Failed to get bilibili dynamic ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

function getFavoriteMessage(id: string, token: any, log: { warn: (data: string) => void; } = console): cardInfo<"favorite"> {
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

    function warn(code: number, message: string) {
        if (log) {
            log.warn(`Failed to get bilibili favorite ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

function getAlbumMessage(id: string, token: any, log: { warn: (data: string) => void; } = console): cardInfo<"album"> {
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

    function warn(code: number, message: string) {
        if (log) {
            log.warn(`Failed to get bilibili album ${id}: { code: ${code}, message: ${message} }`);
        }
    }
}

function getMessage<T extends cardType>(type: T, id: string, token: any, log: { warn: (data: string) => void; } = console): cardInfo<T> {
    switch (type) {
        case "video":
            return getVideoMessage(id, token, log) as cardInfo<T>;
        case "article":
            return getArticleMessage(id, token, log) as cardInfo<T>;
        case "user":
            return getUserMessage(id, token, log) as cardInfo<T>;
        case "live":
            return getLiveMessage(id, token, undefined, log) as cardInfo<T>;
        case "bangumi":
            return getBangumiMessage(id, token, log) as cardInfo<T>;
        case "audio":
            return getAudioMessage(id, token, log) as cardInfo<T>;
        case "dynamic":
            return getDynamicMessage(id, token, log) as cardInfo<T>;
        case "favorite":
            return getFavoriteMessage(id, token, log) as cardInfo<T>;
        case "album":
            return getAlbumMessage(id, token, log) as cardInfo<T>;
        default:
            const code = id?.slice(0, 2).toLowerCase();
            switch (code) {
                case "cv":
                    return getArticleMessage(id, token, log) as cardInfo<T>;
                case "md":
                    return getBangumiMessage(id, token, log) as cardInfo<T>;
                case "au":
                    return getAudioMessage(id, token, log) as cardInfo<T>;
                case "bv":
                case "av":
                default:
                    return getVideoMessage(id, token, log) as cardInfo<T>;
            }
    }
}

async function getMessageAsync<T extends cardType>(type: T, id: string, log: { warn: (data: string) => void; } = console): Promise<cardInfo<T>> {
    const token = await fetch(getApi(id, type))
        .then(x => x.json())
        .catch(ex => ex.toString());
    switch (type) {
        case "video":
            return getVideoMessage(id, token, log) as cardInfo<T>;
        case "article":
            return getArticleMessage(id, token, log) as cardInfo<T>;
        case "user":
            return getUserMessage(id, token, log) as cardInfo<T>;
        case "live":
            return await getLiveMessage(id, token, async (id, log) => {
                const token = await fetch(getApi(id, "user"))
                    .then(x => x.json())
                    .catch(ex => ex.toString());
                return getUserMessage(id, token, log);
            }, log) as cardInfo<T>;
        case "bangumi":
            return getBangumiMessage(id, token, log) as cardInfo<T>;
        case "audio":
            return getAudioMessage(id, token, log) as cardInfo<T>;
        case "dynamic":
            return getDynamicMessage(id, token, log) as cardInfo<T>;
        case "favorite":
            return getFavoriteMessage(id, token, log) as cardInfo<T>;
        case "album":
            return getAlbumMessage(id, token, log) as cardInfo<T>;
        default:
            const code = id?.slice(0, 2).toLowerCase();
            switch (code) {
                case "cv":
                    return getArticleMessage(id, token, log) as cardInfo<T>;
                case "md":
                    return getBangumiMessage(id, token, log) as cardInfo<T>;
                case "au":
                    return getAudioMessage(id, token, log) as cardInfo<T>;
                case "bv":
                case "av":
                default:
                    return getVideoMessage(id, token, log) as cardInfo<T>;
            }
    }
}

export {
    getApi,
    getMessage,
    getMessageAsync
};