<template>
    <h1>{{ title }}</h1>
    <div class="stack-vertical" style="row-gap: 0.3rem;">
        <SettingsCard>
            <template #icon>
                <DesignIdeas20Regular />
            </template>
            <template #header>
                <h3 id="bilibili-card-output" class="unset">生成类型</h3>
            </template>
            <template #description>
                选择生成卡片的类型。
            </template>
            <fluent-select placeholder="components" v-model="output"
                style="min-width: calc(var(--base-height-multiplier) * 11.25px);">
                <fluent-option value="components">控件</fluent-option>
                <fluent-option value="html">HTML</fluent-option>
                <fluent-option value="svg" disabled>SVG</fluent-option>
            </fluent-select>
        </SettingsCard>
        <SettingsCard>
            <template #icon>
                <component :is="getTypeIcon(type)" />
            </template>
            <template #header>
                <h3 id="bilibili-card-type" class="unset">卡片类型</h3>
            </template>
            <template #description>
                选择卡片显示内容的类型。
            </template>
            <fluent-select placeholder="video" v-model="type"
                style="min-width: calc(var(--base-height-multiplier) * 11.25px);">
                <fluent-option v-for="(value, key) in types" :value="key">{{ value }}</fluent-option>
            </fluent-select>
        </SettingsCard>
        <SettingsCard>
            <template #icon>
                <CardUI20Regular />
            </template>
            <template #header>
                <h3 id="bilibili-card-id" class="unset">卡片 ID</h3>
            </template>
            <template #description>
                输入卡片显示的哔哩哔哩{{ types[type] }}的 ID。
            </template>
            <fluent-text-field v-model="id" :placeholder="getExampleID(type)"></fluent-text-field>
        </SettingsCard>
        <SettingsExpander expanded="true">
            <template #icon>
                <DatabaseArrowDown20Regular />
            </template>
            <template #header>
                <h3 id="bilibili-card-get-data" class="unset">获取数据</h3>
            </template>
            <template #description>
                从哔哩哔哩获取 JSON 数据。(由于跨域限制无法自动获取信息，请手动在下方填入 JSON 数据)
            </template>
            <div class="setting-expander-content-grid">
                <InputLabel label="输入 JSON">
                    <template #action>
                        <div class="stack-horizontal" style="width: auto; column-gap: calc(var(--design-unit) * 1px);">
                            <fluent-button title="这个按钮并不能正常使用" :disabled="!id" @click="getApiAsync">自动</fluent-button>
                            <fluent-anchor :href="getApiUrl()" target="_blank">手动</fluent-anchor>
                        </div>
                    </template>
                    <fluent-text-area v-model="json" resize="vertical" style="width: 100%;"></fluent-text-area>
                </InputLabel>
            </div>
        </SettingsExpander>
        <SettingsCard>
            <template #icon>
                <ImageArrowForward20Regular />
            </template>
            <template #header>
                <h3 id="bilibili-card-image-proxy" class="unset">图片代理</h3>
            </template>
            <template #description>
                设置封面图片的代理。
            </template>
            <fluent-text-field v-model="imageProxy" placeholder="https://images.weserv.nl/?url="></fluent-text-field>
        </SettingsCard>
        <SettingsCard>
            <template #icon>
                <TagMultiple20Regular />
            </template>
            <template #header>
                <h3 id="bilibili-card-info-types" class="unset">信息类型</h3>
            </template>
            <template #description>
                设置卡片显示信息的类型。(views, danmakus, comments, favorites, coins, likes)
            </template>
            <fluent-text-field v-model="infoTypes" :placeholder="getDefaultInfoTypes(type)"></fluent-text-field>
        </SettingsCard>
        <SettingsCard>
            <template #icon>
                <Color20Regular />
            </template>
            <template #header>
                <h3 id="bilibili-card-theme" class="unset">卡片主题</h3>
            </template>
            <template #description>
                选择卡片的主题样式。
            </template>
            <!-- @vue-generic {Combobox, "value" } -->
            <ValueChangeHost v-model="theme" value-name="value" event-name="change" style="display: inherit;">
                <fluent-combobox placeholder="default" autocomplete="both" style="min-width: 0;">
                    <fluent-option title="跟随系统">system</fluent-option>
                    <fluent-option title="浅色">light</fluent-option>
                    <fluent-option title="深色">dark</fluent-option>
                    <fluent-option title="Fluent UI">fluent</fluent-option>
                    <fluent-option title="Windose">windose</fluent-option>
                </fluent-combobox>
            </ValueChangeHost>
        </SettingsCard>
        <div class="settings-card"
            :style="{ paddingTop: 'calc(var(--design-unit) * 4px)', paddingRight: 'calc(var(--design-unit) * 4px)', paddingBottom: example ? 'calc(var(--design-unit) * 4px)' : 'calc(var(--design-unit) * 3px)', paddingLeft: 'calc(var(--design-unit) * 4px)' }">
            <InputLabel label="预览" v-fill-color="neutralFillInputRest">
                <template #action>
                    <div class="stack-horizontal" style="width: auto; column-gap: calc(var(--design-unit) * 1px);">
                        <fluent-button v-show="example"
                            @click="(e: MouseEvent) => onCopyClicked(e, example)">复制代码</fluent-button>
                        <fluent-button
                            @click="() => createExample(json, imageProxy, id, type, infoTypes, theme)">生成卡片</fluent-button>
                    </div>
                </template>
                <div ref="example" v-show="example" style="max-width: 100%;"></div>
            </InputLabel>
        </div>
    </div>
</template>

<script lang="ts" setup>
import "../types";
import "../helpers/fluentui";
import { shallowRef, useTemplateRef } from "vue";
import { useSeoMeta } from "@unhead/vue";
import { name } from "../../package.json";
import { neutralFillInputRest, type Combobox } from "@fluentui/web-components";
import { encodeHTML } from "entities";
import hljs from "../helpers/hljs";
import html_beautify from "js-beautify/js/src/html";
import type { cardType, themeType } from "../../src/helpers/types";
import * as message from "../../src/tools/bilibili-card-message";
import * as builder from "../../src/tools/bilibili-card-builder";
import { getTheme } from "../../src/helpers/theme";
import InputLabel from "../components/InputLabel.vue";
import SettingsCard from "../components/SettingsCard.vue";
import SettingsExpander from "../components/SettingsExpander.vue";
import ValueChangeHost from "../components/ValueChangeHost.vue";
import vFillColor from "../directives/fillColor";
import DesignIdeas20Regular from "@fluentui/svg-icons/icons/design_ideas_20_regular.svg";
import CardUI20Regular from "@fluentui/svg-icons/icons/card_ui_20_regular.svg";
import DatabaseArrowDown20Regular from "@fluentui/svg-icons/icons/database_arrow_down_20_regular.svg";
import ImageArrowForward20Regular from "@fluentui/svg-icons/icons/image_arrow_forward_20_regular.svg";
import TagMultiple20Regular from "@fluentui/svg-icons/icons/tag_multiple_20_regular.svg";
import Color20Regular from "@fluentui/svg-icons/icons/color_20_regular.svg";
import VideoClip20Regular from "@fluentui/svg-icons/icons/video_clip_20_regular.svg";
import Document20Regular from "@fluentui/svg-icons/icons/document_20_regular.svg";
import Person20Regular from "@fluentui/svg-icons/icons/person_20_regular.svg";
import Live20Regular from "@fluentui/svg-icons/icons/live_20_regular.svg";
import MoviesAndTv20Regular from "@fluentui/svg-icons/icons/movies_and_tv_20_regular.svg";
import MusicNote220Regular from "@fluentui/svg-icons/icons/music_note_2_20_regular.svg";
import Feed20Regular from "@fluentui/svg-icons/icons/feed_20_regular.svg";
import Collections20Regular from "@fluentui/svg-icons/icons/collections_20_regular.svg";
import Album20Regular from "@fluentui/svg-icons/icons/album_20_regular.svg";
import PresenceUnknown20Regular from "@fluentui/svg-icons/icons/presence_unknown_20_regular.svg";

const title = "哔哩哔哩卡片";
const description = "哔哩哔哩卡片生成器";
useSeoMeta({
    // Basic SEO
    title: `${title} | ${name}`,
    description,

    // Open Graph
    ogTitle: title,
    ogDescription: description,
    ogSiteName: name
});

const imageProxy = shallowRef('');
const infoTypes = shallowRef('');

const types = {
    video: "视频",
    article: "专栏",
    user: "用户",
    live: "直播",
    bangumi: "番剧",
    audio: "音频",
    dynamic: "动态",
    favorite: "收藏夹",
    album: "相簿"
};

const id = shallowRef('');
const type = shallowRef<cardType>("video");
function getApiUrl() {
    const idValue = id.value;
    if (!idValue) { return null; }
    else { return message.getApi(idValue, type.value); }
};

const json = shallowRef('');
async function getApiAsync() {
    const idValue = id.value;
    if (!idValue) { return; }
    json.value = await fetch(message.getApi(idValue, type.value))
        .then(x => x.text())
        .catch(ex => ex.toString());
};

function getTypeIcon(typeValue: cardType) {
    switch (typeValue) {
        case "video":
            return VideoClip20Regular;
        case "article":
            return Document20Regular;
        case "user":
            return Person20Regular;
        case "live":
            return Live20Regular;
        case "bangumi":
            return MoviesAndTv20Regular;
        case "audio":
            return MusicNote220Regular;
        case "dynamic":
            return Feed20Regular;
        case "favorite":
            return Collections20Regular;
        case "album":
            return Album20Regular;
        default:
            return PresenceUnknown20Regular;
    }
};

function getExampleID(typeValue: string) {
    switch (typeValue) {
        case "video":
            return "BV1y54y1a768";
        case "article":
            return "cv8930865";
        case "user":
            return "266112738";
        case "live":
            return "12720436";
        case "bangumi":
            return "md1689";
        case "audio":
            return "au13598";
        case "dynamic":
            return "501590001933778048";
        case "favorite":
            return "1026854530";
        case "album":
            return "99184721";
    }
};

function getDefaultInfoTypes(typeValue: string) {
    switch (typeValue) {
        case "video":
            return "views, danmakus";
        case "user":
            return "views, likes";
        case "live":
            return "views";
        case "bangumi":
            return "favorites";
        case "favorite":
            return "views, favorites";
        case "article":
        case "audio":
        case "dynamic":
        case "album":
        default:
            return "views, comments";
    }
};

function onCopyClicked(event: MouseEvent, text: string) {
    const button = event.target;
    navigator.clipboard.writeText(text)
        .then(() => {
            if (button instanceof HTMLElement) {
                const content = button.innerHTML;
                button.innerText = "已复制";
                setTimeout(() => button.innerHTML = content, 1000)
            }
        });
};

function createExample(jsonValue: string, imageProxyValue: string, idValue: string, typeValue: cardType, infoTypesValue: string, themeValue: themeType) {
    updateExample(createCard(JSON.parse(jsonValue), imageProxyValue, idValue, typeValue, infoTypesValue, themeValue));
};

const example = shallowRef('');
const exampleEl = useTemplateRef("example");
function updateExample(element?: string) {
    const exampleElement = exampleEl.value;
    if (exampleElement instanceof HTMLElement) {
        if (!element) {
            exampleElement.innerHTML = example.value = '';
        }
        else {
            element = html_beautify(element);
            exampleElement.innerHTML = example.value = element;
            const pre = document.createElement("pre");
            pre.className = "highlight html language-html";
            pre.style.marginTop = "calc(var(--design-unit) * 1px)";
            pre.style.marginBottom = "unset";
            pre.style.borderRadius = "6px";
            const code = document.createElement("code");
            code.innerHTML = encodeHTML(element);
            pre.appendChild(code);
            exampleElement.appendChild(pre);
            hljs.highlightElement(code);
        }
    }
};

function createCard(token: any, imageProxyValue: string, idValue: string, typeValue: cardType, infoTypesValue: string, themeValue: themeType) {
    if (!token) { return ''; }
    const _message = message.getMessage(typeValue, idValue, token, console);
    return createElement(imageProxyValue, infoTypesValue, _message, themeValue);
};

const output = shallowRef("components");
const theme = shallowRef<themeType>('' as themeType);
function createElement(imageProxyValue: string, infoTypesValue: string, { vid, type: msgType, title, author, cover, duration, views, danmakus, comments, favorites, coins, likes }: any, themeValue: themeType) {
    switch (output.value) {
        case "components":
            return builder.createHost(imageProxyValue, infoTypesValue, { vid, type: msgType, title, author, cover, duration, views, danmakus, comments, favorites, coins, likes }, themeValue).outerHTML;
        case "html":
            const card = builder.createCardWithTagName("div", imageProxyValue, infoTypesValue, { vid, type: msgType, title, author, cover, duration, views, danmakus, comments, favorites, coins, likes }, themeValue);
            if (card instanceof HTMLElement) {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = getTheme(themeValue || '0');
                console.log(themeValue, getTheme(themeValue || '0'));
                card.insertBefore(link, card.firstChild);
                return card.innerHTML;
            }
    }
};
</script>

<style lang="scss" scoped>
:deep(fluent-select)::part(listbox),
:deep(fluent-select) .listbox,
:deep(fluent-combobox)::part(listbox),
:deep(fluent-combobox) .listbox {
    max-height: calc(var(--base-height-multiplier) * 30px);
}

.stack-vertical,
:deep(.stack-vertical) {
    display: flex;
    flex-direction: column;
}

.stack-horizontal,
:deep(.stack-horizontal) {
    display: flex;
    flex-direction: row;
}

:deep(h6.unset),
:deep(h5.unset),
:deep(h4.unset),
:deep(h3.unset),
:deep(h2.unset),
:deep(h1.unset) {
    margin-top: 0;
    margin-bottom: 0;
    font-weight: inherit;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}
</style>