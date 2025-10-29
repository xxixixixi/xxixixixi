import HelloWorld from "../components/HelloWorld.vue";

export const routes = [
    {
        path: '/',
        name: '题目',
        component: HelloWorld
    },
    {
        path: '/about',
        name: '关于',
        component: HelloWorld
    },
]