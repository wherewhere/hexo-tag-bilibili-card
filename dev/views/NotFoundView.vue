<template>
    <h1>{{ title }}</h1>
    {{ description }}<br />
    <span v-if="countTime > 0">预计将在约 {{ countTime }} 秒后返回首页。</span>
    <span v-else-if="!countTime">即将跳转到首页。</span>
    <span v-else="countTime < 0">自动跳转失败。</span><br />
    您可以<RouterLink :to="{ name: 'index' }"><b>点这里</b></RouterLink>直接返回首页。
</template>

<script lang="ts" setup>
import { onMounted, shallowRef } from "vue";
import { useSeoMeta } from "@unhead/vue";
import { useRouter } from "vue-router";
import { name } from "../../package.json";

const title = "404 找不到页面";
const description = "对不起，您所访问的页面不存在或者已删除。";
useSeoMeta({
    // Basic SEO
    title: `${title} | ${name}`,
    description,

    // Open Graph
    ogTitle: title,
    ogDescription: description,
    ogSiteName: name
});

const router = useRouter();
const countTime = shallowRef(6);

onMounted(() => {
    function count() {
        if (--countTime.value > 0) {
            setTimeout(count, 1000);
        }
        else if (!countTime.value) {
            router.push({ name: "index" });
        }
    }
    count();
});
</script>