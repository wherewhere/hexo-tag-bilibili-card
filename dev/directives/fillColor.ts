import { toRaw, type Directive, type DirectiveHook } from "vue";
import { registerColorSchemeListener, unregisterColorSchemeListener } from "color-scheme-checker/src/monitor";
import { fillColor, type Swatch } from "@fluentui/web-components";
import type { DesignToken } from "@microsoft/fast-foundation";

const observer = new WeakMap<HTMLElement, () => void>();

function addListener(element: HTMLElement, callback: () => void) {
    observer.set(element, callback);
    registerColorSchemeListener(callback, element);
    callback();
}

function removeListener(element: HTMLElement) {
    const callback = observer.get(element);
    if (callback) {
        unregisterColorSchemeListener(callback, element);
        observer.delete(element);
    }
}

const register: DirectiveHook<HTMLElement, any, DesignToken<Swatch> | undefined, string, any> = async (element, binding) => {
    if (element instanceof HTMLElement) {
        if (binding.value !== binding.oldValue) {
            const color = toRaw(binding.value);
            if (color) {
                addListener(element, () => fillColor.setValueFor(element, color.getValueFor(element.parentElement!)));
            }
            else {
                fillColor.deleteValueFor(element);
                removeListener(element);
            }
        }
    }
};

const unregister: DirectiveHook<HTMLElement, any, DesignToken<Swatch> | undefined, string, any> = element => {
    if (element instanceof HTMLElement) {
        removeListener(element);
    }
};

const directive: Directive<HTMLElement, DesignToken<Swatch> | undefined> = {
    mounted: register,
    updated: register,
    unmounted: unregister
}

export default directive;