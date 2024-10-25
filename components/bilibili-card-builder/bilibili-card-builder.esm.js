import "./bilibili-card-builder.js";
const global =
    typeof this !== "undefined" ? this
        : typeof globalThis !== "undefined" ? globalThis
            : typeof window !== "undefined" ? window : {};
const bilibiliCardBuilder = global.$bilibiliCardBuilder;
delete global.$bilibiliCardBuilder;
export default bilibiliCardBuilder;
