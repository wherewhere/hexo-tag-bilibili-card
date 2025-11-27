/** @type {import("vite").Plugin} */
export default {
    name: "eval",
    enforce: "pre",
    resolveId(source) {
        if (source.startsWith("javascript:")) {
            return source;
        }
    },
    async load(id) {
        if (id.startsWith("javascript:")) {
            const code = id.slice("javascript:".length);
            const result = await new Function(`return (${code})`)();
            return `export default ${JSON.stringify(result)}`;
        }
    }
};