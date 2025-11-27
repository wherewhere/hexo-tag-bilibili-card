declare const _wb_wombat: {
    rewrite_url(url: string): string;
    extract_orig(url: string): string;
} | undefined;

export function getBackgroundUrl(proxy: string, url: string) {
    if (typeof _wb_wombat === "undefined") {
        return `${proxy}${url}`
    }
    else {
        return _wb_wombat.rewrite_url(`${proxy}${_wb_wombat.extract_orig(url)}`);
    }
}

export const defaultProxy = typeof _wb_wombat === "undefined" ? "https://images.weserv.nl/?url=" : '';