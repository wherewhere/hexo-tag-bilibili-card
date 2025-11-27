import type { FunctionDirective } from "vue";

const directive: FunctionDirective<HTMLElement, string | number | boolean, string, string> = (element, binding) => {
    if (element instanceof HTMLElement) {
        const value = binding.value;
        if (value !== binding.oldValue) {
            const name = binding.arg;
            if (name) {
                element.setAttribute(name, value.toString());
            }
        }
    }
};

export default directive;