// rollup.config.mjs
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import postcssPresetEnv from "postcss-preset-env";
import url from "./src/lib/import-url.mjs";

const resolveConfig = resolve({
    extensions: [".ts"]
});

const babelESConfig = babel({
    extensions: [".ts"],
    targets: "defaults",
    babelHelpers: "bundled"
});

const babelCJSConfig = babel({
    extensions: [".ts"],
    targets: "maintained node versions",
    babelHelpers: "bundled"
});

const babelESFallbackConfig = babel({
    extensions: [".ts"],
    targets: "supports es6-module",
    babelHelpers: "bundled"
});

const babelIIFEConfig = babel({
    extensions: [".ts"],
    targets: "defaults",
    babelHelpers: "bundled"
});

const babelIIFEFallbackConfig = babel({
    extensions: [".ts"],
    targets: "supports flexbox",
    babelHelpers: "bundled"
});

const dtsConfig = dts();

const postcssConfig = postcss({
    extract: true,
    sourceMap: true
});

const postcssFallbackConfig = postcss({
    extract: true,
    sourceMap: true,
    plugins: [postcssPresetEnv({
        stage: 1,
        browsers: ["IE >= 1", "Firefox >= 1", "Chrome >= 1", "Safari >= 1", "Opera >= 1"]
    })]
});

const urlConfig = url({
    limit: false,
    include: ["**/*.*"],
    fileName: "[dirname][name][extname]"
});

const esPlugin = [resolveConfig, babelESConfig, postcssConfig, urlConfig];
const esFallbackPlugin = [resolveConfig, babelESFallbackConfig, postcssFallbackConfig, urlConfig];
const iifePlugin = [resolveConfig, babelIIFEConfig, postcssConfig, urlConfig];
const iifeFallbackPlugin = [resolveConfig, babelIIFEFallbackConfig, postcssFallbackConfig, urlConfig];
const cjsPlugin = [resolveConfig, babelCJSConfig, urlConfig];
const dtsPlugin = [dtsConfig, postcssConfig];

/**
 * @param {string} fileName
 * @returns {import("rollup").RollupOptions}
 */
function getESConfig(fileName, fallback = false) {
    return {
        input: `src/${fileName}.ts`,
        output: {
            sourcemap: true,
            format: "es",
            file: fallback ? `dist/fallback/${fileName}.esm.js` : `dist/${fileName}.esm.js`,
        },
        plugins: fallback ? esFallbackPlugin : esPlugin
    };
}

/**
 * @param {string} fileName
 * @param {string} name
 * @returns {import("rollup").RollupOptions}
 */
function getIIFEConfig(fileName, name, fallback = false) {
    return {
        input: `src/${fileName}.ts`,
        output: {
            sourcemap: true,
            format: "iife",
            file: fallback ? `dist/fallback/${fileName}.js` : `dist/${fileName}.js`,
            name
        },
        plugins: fallback ? iifeFallbackPlugin : iifePlugin
    };
}

/**
 * @param {string} fileName
 * @returns {import("rollup").RollupOptions}
 */
function getCJSConfig(fileName) {
    return {
        input: `src/${fileName}.ts`,
        output: {
            sourcemap: true,
            format: "cjs",
            file: `dist/${fileName}.cjs`
        },
        plugins: cjsPlugin
    };
}

/**
 * @param {string} fileName
 * @returns {import("rollup").RollupOptions}
 */
function getDTSConfig(fileName, fallback = false) {
    return {
        input: `src/${fileName}.ts`,
        output: {
            format: "es",
            file: fallback ? `dist/fallback/${fileName}.d.ts` : `dist/${fileName}.d.ts`,
        },
        plugins: dtsPlugin
    };
}

/**
 * @param {string} fileName
 * @param {string} name
 * @param {import("rollup").ModuleFormat[]} types
 */
function* getJSConfigs(fileName, name, types) {
    for (const type of types) {
        switch (type) {
            case "es":
                yield getESConfig(fileName);
                yield getESConfig(fileName, true);
                break;
            case "iife":
                yield getIIFEConfig(fileName, name);
                yield getIIFEConfig(fileName, name, true);
                break;
            case "dts":
                yield getDTSConfig(fileName);
                yield getDTSConfig(fileName, true);
                break;
            case "cjs":
                yield getCJSConfig(fileName);
                break;
        }
    }
}

/** @type {import("rollup").RollupOptions[]} */
export default [{
    input: "src/index.es.ts",
    output: {
        format: "es",
        sourcemap: true,
        dir: "dist",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].es.js",
        manualChunks: {
            "helpers": ["src/helpers/builder", "src/helpers/polyfill", "src/helpers/url"],
            "components/bilibili-card": ["src/components/bilibili-card"],
            "components/bilibili-card.css": ["src/components/bilibili-card.css"],
            "components/bilibili-card.dark.css": ["src/components/bilibili-card.dark.css"],
            "components/bilibili-card.fluent.css": ["src/components/bilibili-card.fluent.css"],
            "components/bilibili-card.light.css": ["src/components/bilibili-card.light.css"],
            "components/bilibili-card.windose.css": ["src/components/bilibili-card.windose.css"],
            "tools/bilibili-card-builder": ["src/tools/bilibili-card-builder"],
            "tools/bilibili-card-message": ["src/tools/bilibili-card-message"]
        },
        minifyInternalExports: false
    },
    plugins: esPlugin
}, {
    input: "src/index.cjs.ts",
    output: {
        format: "cjs",
        sourcemap: true,
        dir: "dist",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].cjs.js",
        exports: "auto",
        manualChunks: {
            "lib/create-card": ["src/lib/create-card"],
            "tools/bilibili-card-builder": ["src/tools/bilibili-card-builder"],
            "tools/bilibili-card-message": ["src/tools/bilibili-card-message"]
        },
        minifyInternalExports: false
    },
    plugins: esPlugin
},
    // ...getJSConfigs("tools/bilibili-card-builder", "biliBiliCardBuilder", ["iife"]),
    // ...getJSConfigs("tools/bilibili-card-message", "biliBiliCardMessage", ["iife"]),
    // ...getJSConfigs("components/bilibili-card/bilibili-card", "BiliBiliCard", ["iife"])
];