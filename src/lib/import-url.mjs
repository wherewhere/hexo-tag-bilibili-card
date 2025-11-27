import _url from "@rollup/plugin-url";

/**
 * @param {import("@rollup/plugin-url").RollupUrlOptions} options
 * @returns {import("rollup").Plugin}
 */
export default function url(options = {}) {
    const { load, generateBundle } = _url(options);
    return {
        name: "import-url",
        load(id) {
            if (id.endsWith("?url")) {
                return load.call(this, id.slice(0, -4));
            }
            return null;
        },
        generateBundle
    };
}