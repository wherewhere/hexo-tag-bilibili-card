import "./bilibili-card.js";
/** @typedef {import("./bilibili-card.js").BiliBiliCard} BiliBiliCard */
/** @type {{$BiliBiliCard: BiliBiliCard}} */
const global =
    typeof globalThis !== "undefined" ? globalThis
        : typeof window !== "undefined" ? window : {};
/** @type {BiliBiliCard} */
const BiliBiliCard = global.$BiliBiliCard || customElements.get("bilibili-card");
delete global.$BiliBiliCard;
const url = import.meta.url;
BiliBiliCard.baseUrl = `${url.substring(0, url.lastIndexOf('/') + 1)}bilibili-card`;
export default BiliBiliCard;