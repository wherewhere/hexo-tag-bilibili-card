import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import simpleHtmlPlugin from "vite-plugin-simple-html";
import markdown from "./helpers/markdown.mts";
import eval from "./helpers/eval.mts";
import githubImporter from "./helpers/github-importer.mts";

export default defineConfig({
    root: "dev",
    base: "./",
    plugins: [
        vue({
            include: [/\.vue$/, /\.md$/],
            template: {
                compilerOptions: {
                    isCustomElement: tag => tag.includes('-')
                }
            }
        }),
        svgLoader(),
        simpleHtmlPlugin({
            minify: {
                minifyJs: true,
                sortSpaceSeparatedAttributeValues: true,
                sortAttributes: true,
                tagOmission: false
            }
        }),
        markdown,
        eval
    ],
    css: {
        preprocessorOptions: {
            scss: {
                importers: [githubImporter]
            }
        },
        devSourcemap: true
    },
    build: {
        outDir: "dist",
        sourcemap: true,
        minify: "terser"
    }
});