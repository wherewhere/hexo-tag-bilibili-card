import type { Plugin } from "vite";
import MarkdownIt from "markdown-it-async";
import hljs from "markdown-it-highlightjs";

export default {
    name: "markdown",
    enforce: "pre",
    async transform(code, id) {
        if (!id.endsWith('.md')) { return; }
        code = code.replace(/<!-- Example Start -->[\s\S]*<!-- Example End -->/i, "<slot></slot>");
        const md = MarkdownIt({
            html: true,
            linkify: true,
            typographer: true
        }).use(hljs);
        const html = await md.renderAsync(code, { id });
        return {
            code: `<template>\n${html}\n</template>`,
            map: {
                mappings: ''
            }
        };
    }
} as Plugin;