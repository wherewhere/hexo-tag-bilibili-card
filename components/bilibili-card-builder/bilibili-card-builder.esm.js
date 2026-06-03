import "./bilibili-card-builder.js";
/** @type {{$bilibiliCardBuilder: import("./bilibili-card-builder.js")}} */
const global =
    typeof globalThis !== "undefined" ? globalThis
        : typeof window !== "undefined" ? window : {};
const bilibiliCardBuilder = global.$bilibiliCardBuilder;
delete global.$bilibiliCardBuilder;
export default bilibiliCardBuilder;