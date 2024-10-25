import "./bilibili-card.js";
const global =
    typeof this !== "undefined" ? this
        : typeof globalThis !== "undefined" ? globalThis
            : typeof window !== "undefined" ? window : {};
const BiliBiliCard = global.$BiliBiliCard ?? customElements.get("bilibili-card");
delete global.$BiliBiliCard;
const url = import.meta.url;
BiliBiliCard.baseUrl = `${url.substring(0, url.lastIndexOf('/') + 1)}bilibili-card`;
export { BiliBiliCard };
