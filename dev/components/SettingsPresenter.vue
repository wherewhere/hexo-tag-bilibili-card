<template>
    <div class="settings-presenter" v-fill-color="fillColor">
        <div class="header-root">
            <div class="icon-holder" v-check-solt="$slots.icon">
                <slot name="icon"></slot>
            </div>
            <div class="header-panel">
                <span v-check-solt="$slots.header">
                    <slot name="header"></slot>
                </span>
                <span class="description" v-check-solt="$slots.description">
                    <slot name="description"></slot>
                </span>
            </div>
        </div>
        <div class="content-presenter" v-check-solt="$slots.default">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { inject } from "vue";
import type { Swatch } from "@fluentui/web-components";
import type { DesignToken } from "@microsoft/fast-foundation";
import vCheckSolt from "../directives/checkSolt";
import vFillColor from "../directives/fillColor";

const fillColor = inject<DesignToken<Swatch>>("fillColor");
</script>

<style lang="scss" scoped>
.settings-presenter {
    --settings-card-description-font-size: var(--type-ramp-minus-1-font-size);
    --settings-card-header-icon-max-size: var(--type-ramp-base-line-height);
    --settings-card-header-icon-margin: 0 calc((var(--base-horizontal-spacing-multiplier) * 6 + var(--design-unit) * 0.5) * 1px) 0 calc((var(--base-horizontal-spacing-multiplier) * 6 - var(--design-unit) * 4) * 1px);
    --settings-card-vertical-header-content-spacing: calc(var(--design-unit) * 2px) 0 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    :deep(div.header-root) {
        display: flex;
        align-items: center;
        flex: 1;
    }

    :deep(div.icon-holder) {
        max-width: var(--settings-card-header-icon-max-size);
        max-height: var(--settings-card-header-icon-max-size);
        margin: var(--settings-card-header-icon-margin);
        fill: currentColor;
    }

    :deep(div.header-panel) {
        display: flex;
        flex-direction: column;
        margin: 0 calc(var(--design-unit) * 6px) 0 0;
    }

    :deep(span.description) {
        font-size: var(--settings-card-description-font-size);
        color: var(--neutral-fill-strong-hover);
    }

    :deep(div.content-presenter) {
        display: grid;
    }

    :deep(a.text-button) {
        font-weight: bold;
        text-decoration: inherit;
    }

    @media (max-width: 640px) {
        flex-flow: column;
        justify-content: normal;
        align-items: normal;

        :deep(div.header-panel) {
            margin: 0;
        }

        :deep(div.content-presenter) {
            margin: var(--settings-card-vertical-header-content-spacing);
        }

        .settings-nowarp & {
            flex-flow: row;
            justify-content: space-between;
            align-items: center;

            :deep(div.header-panel) {
                margin: 0 calc(var(--design-unit) * 6px) 0 0;
            }

            :deep(div.content-presenter) {
                margin: 0;
            }
        }

        .settings-keepwarp & {
            flex-flow: column;
            justify-content: normal;
            align-items: normal;

            :deep(div.header-panel) {
                margin: 0;
            }

            :deep(div.content-presenter) {
                margin: var(--settings-card-vertical-header-content-spacing);
            }
        }
    }
}
</style>