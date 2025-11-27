export function initDOM() {
    const isModule = typeof module !== "undefined" && typeof module.exports !== "undefined";
    if (isModule) {
        if (typeof document === "undefined") {
            const { JSDOM } = require("jsdom");
            /** @type {Window} */
            const window = new JSDOM().window;
            /** @type {Document} */
            const document = window.document;
            return { window, document };
        }
    }
    return { window, document };
}