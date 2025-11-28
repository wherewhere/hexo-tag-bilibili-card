declare module "bilibili-card:*" {
    import type { defineComponent, HTMLAttributes, VNode } from "vue";
    export const render: (_ctx: object, _cache: any[]) => VNode;
    const component: ReturnType<typeof defineComponent<HTMLAttributes>>;
    export default component;
}