import "./bilibili-card-builder.js";
const global =
    typeof this !== "undefined" ? this
        : typeof globalThis !== "undefined" ? globalThis
            : typeof window !== "undefined" ? window : {};
const bilibiliCardBuilder = global._bilibiliCardBuilder;
delete global._bilibiliCardBuilder;
export { bilibiliCardBuilder };
