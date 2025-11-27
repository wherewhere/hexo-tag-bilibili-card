import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
    history: createWebHistory(new URL(document.baseURI).pathname),
    routes: [{
        name: "index",
        path: '/',
        alias: ["/index.html"],
        component: () => import("./views/IndexView.vue")
    }, {
        name: "maker",
        path: "/maker.html",
        component: () => import("./views/MakerView.vue")
    }, {
        name: "404",
        path: "/:pathMatch(.*)*",
        component: () => import("./views/NotFoundView.vue")
    }]
});