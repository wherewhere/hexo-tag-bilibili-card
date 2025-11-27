/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare module "*.md" {
    import type { defineComponent } from "vue";
    const component: ReturnType<typeof defineComponent<object>>;
    export default component;
}

declare module "javascript:*" {
    const value: any;
    export default value;
}

declare module "javascript:new Date().getFullYear()" {
    const value: number;
    export default value;
}

declare module "js-beautify/js/src/html" {
    export default function style_html(html_source: string, options?: Record<string, string>, js_beautify?: Function, css_beautify?: Function): string;
}