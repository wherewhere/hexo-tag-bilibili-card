<template>
    <div class="input-label">
        <div class="fluent-input-label">
            <label>{{ label }}</label>
            <slot name="action"></slot>
        </div>
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    label?: string;
}>();
</script>

<style lang="scss" scoped>
@use "github:microsoft/fluentui-blazor?branch=dev&path=/src/Core/Components/Label/FluentInputLabel.razor.css";

.input-label .fluent-input-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: default;

    label {
        cursor: pointer;
    }
}
</style>