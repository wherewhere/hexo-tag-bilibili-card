<template>
    <div ref="root">
        <slot></slot>
    </div>
</template>

<script generic="TElement extends HTMLElement, TKey extends keyof TElement" lang="ts" setup>
import { onMounted, useTemplateRef, watch } from "vue";

const { eventName, valueName } = defineProps<{
    eventName: keyof HTMLElementEventMap;
    valueName: TKey;
}>();
const root = useTemplateRef("root");
watch(
    () => eventName,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            if (root instanceof HTMLElement) {
                const element = root.children[0];
                if (element instanceof HTMLElement) {
                    if (oldValue) {
                        element.removeEventListener(oldValue, onValueChanged);
                    }
                    if (newValue) {
                        element.addEventListener(newValue, onValueChanged);
                    }
                }
            }
        }
    });

const modelValue = defineModel<TElement[TKey]>();
watch(
    modelValue,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            if (newValue !== oldValue) {
                if (valueName) {
                    if (root instanceof HTMLElement) {
                        const element = root.children[0] as TElement;
                        if (element instanceof HTMLElement) {
                            element[valueName] = newValue!;
                        }
                    }
                }
            }
        }
    });

function onValueChanged<K extends keyof HTMLElementEventMap>(event: HTMLElementEventMap[K]) {
    const target = event.target as TElement;
    if (target instanceof HTMLElement) {
        modelValue.value = target[valueName];
    }
}

onMounted(() => {
    if (eventName && valueName) {
        if (root.value instanceof HTMLElement) {
            const element = root.value.children[0] as TElement;
            if (element instanceof HTMLElement) {
                if (modelValue.value === undefined) {
                    modelValue.value = element[valueName];
                }
                else {
                    element[valueName] = modelValue.value;
                }
                element.addEventListener(eventName, onValueChanged);
            }
        }
    }
});
</script>