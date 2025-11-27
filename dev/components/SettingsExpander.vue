<template>
    <fluent-accordion class="settings-expander">
        <fluent-accordion-item class="expander" :expanded="expanded">
            <div slot="heading">
                <ProvideValue name="fillColor" :value="neutralFillInputRest">
                    <SettingsPresenter class="presenter">
                        <template #icon>
                            <slot name="icon"></slot>
                        </template>
                        <template #header>
                            <slot name="header"></slot>
                        </template>
                        <template #description>
                            <slot name="description"></slot>
                        </template>
                        <slot name="action-content"></slot>
                    </SettingsPresenter>
                </ProvideValue>
            </div>
            <div v-fill-color="neutralFillLayerAltRest">
                <ProvideValue name="fillColor" :value="undefined">
                    <slot></slot>
                </ProvideValue>
            </div>
        </fluent-accordion-item>
    </fluent-accordion>
</template>

<script lang="ts" setup>
import { neutralFillInputRest, neutralFillLayerAltRest } from "@fluentui/web-components";
import ProvideValue from "./ProvideValue.vue";
import SettingsPresenter from "./SettingsPresenter.vue";
import vFillColor from "../directives/fillColor";

defineProps<{
    expanded?: "true" | "false";
}>();
</script>

<style lang="scss" scoped>
.settings-expander {
    --settings-expander-header-padding: calc(var(--design-unit) * 1px) 0 calc(var(--design-unit) * 1px) calc(var(--design-unit) * 2px);
    --settings-expander-item-padding: 0 calc((var(--base-height-multiplier) + 1 + var(--density)) * var(--design-unit) * 1px) 0 calc((var(--base-horizontal-spacing-multiplier) * 12 - var(--design-unit) * 1.5) * 1px + var(--type-ramp-base-line-height));

    :deep(fluent-accordion-item.expander) {
        box-sizing: border-box;
        box-shadow: var(--elevation-shadow-card-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
    }

    :deep(fluent-accordion-item.expander) {
        &:hover {
            background: var(--neutral-fill-input-hover);
            border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-layer-hover);
            box-shadow: var(--elevation-shadow-card-hover);
        }

        &:active {
            background: var(--neutral-fill-input-active);
            border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-layer-active);
            box-shadow: var(--elevation-shadow-card-pressed);
        }

        &::part(region),
        .region {
            border-bottom-left-radius: calc((var(--control-corner-radius) - var(--stroke-width)) * 1px);
            border-bottom-right-radius: calc((var(--control-corner-radius) - var(--stroke-width)) * 1px);
        }
    }

    :deep(.presenter) {
        padding: var(--settings-expander-header-padding);
    }

    :deep(div.setting-expander-content-grid) {
        padding: var(--settings-expander-item-padding);
    }
}
</style>