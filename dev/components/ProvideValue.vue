<template>
  <slot></slot>
</template>

<script generic="T" lang="ts" setup>
import { computed, provide } from "vue";

const { name, value } = defineProps<{
  name: string;
  value: T;
}>();

provide(name, computed(() => value));
</script>