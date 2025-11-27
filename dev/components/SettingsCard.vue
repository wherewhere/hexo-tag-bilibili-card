<template>
    <div class="settings-card">
        <ProvideValue name="fillColor" :value="fillColor">
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
                <slot></slot>
            </SettingsPresenter>
        </ProvideValue>
    </div>
</template>

<script lang="ts" setup>
import { inject, shallowRef } from "vue";
import { neutralFillInputRest, type Swatch } from "@fluentui/web-components";
import type { DesignToken } from "@microsoft/fast-foundation";
import ProvideValue from "./ProvideValue.vue";
import SettingsPresenter from "./SettingsPresenter.vue";

const fillColor = shallowRef(inject<DesignToken<Swatch>>("fillColor", neutralFillInputRest));
</script>

<style lang="scss">
.settings-card {
    display: block;
    box-sizing: border-box;
    background: var(--neutral-fill-input-rest);
    color: var(--neutral-foreground-rest);
    border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-layer-rest);
    border-radius: calc(var(--control-corner-radius) * 1px);
    box-shadow: var(--elevation-shadow-card-rest);
    --settings-card-padding: calc(var(--design-unit) * 4px);

    .presenter {
        padding: var(--settings-card-padding);
    }
}
</style>