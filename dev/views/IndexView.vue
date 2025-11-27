<template>
    <ReadMe>
        <div style="display: flex; flex-direction: column; row-gap: 0.5rem;">
            <fluent-text-area placeholder="<bilibili-card></bilibili-card>" resize="vertical" warp="off"
                v-attribute:rows="4" style="width: 100%; font-family: var(--font-monospace);" v-model="example">
                代码：
            </fluent-text-area>
            <div>
                <div style="display: flex; flex-direction: column;">
                    <div class="label">显示：</div>
                </div>
                <div style="display: block;" v-html="example"></div>
            </div>
        </div>
    </ReadMe>
</template>

<script lang="ts" setup>
import "../types";
import { shallowRef } from "vue";
import ReadMe from "../../README.md";
import vAttribute from "../directives/attribute";

const example = shallowRef(
    `<bilibili-card vid="BV1y54y1a768" type="video" title="【UWP】手把手教你安装 UWP 安装包" author="where-where"
    cover="http://i2.hdslb.com/bfs/archive/41bc750cb5011bb036e008a716a89158c7eb7bb5.jpg" duration="05:21" views="2.2万"
    danmakus="4" comments="75" favorites="253" coins="106" likes="287" info-types="views danmakus"
    theme="system"></bilibili-card>`);
</script>

<style lang="scss" scoped>
:deep(img) {
    max-width: 100%;
}

:deep(pre) {
    margin-bottom: 0.5rem;
    border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-rest);
    border-radius: calc(var(--control-corner-radius) * 1px);
}

:deep(table) {
    border-collapse: separate;
}

:deep(fluent-text-area) textarea {
    width: 100%;
}

:deep(fluent-text-area[wrap='off'])::part(control) {
    white-space-collapse: preserve;
    text-wrap-mode: nowrap;
    overflow-wrap: normal;
}
</style>