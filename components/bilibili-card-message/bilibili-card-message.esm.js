import "./bilibili-card-message.js";
const global =
    typeof this !== "undefined" ? this
        : typeof globalThis !== "undefined" ? globalThis
            : typeof window !== "undefined" ? window : {};
const bilibiliCardMessage = global.$bilibiliCardMessage;
delete global.$bilibiliCardMessage;
export default bilibiliCardMessage;
