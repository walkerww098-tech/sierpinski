/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import index from '@/pages/index.vue'
import gasket from '@/pages/gasket.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: index, meta: { title: 'シェルピンスキー・カーペット' } },
        { path: '/gasket', component: gasket, meta: { title: 'シェルビンスキー・ガスケット' } },
    ],
})
router.beforeEach((to) => {
    document.title = (to.meta.title as string) || 'NO TITLE';
});

export default router
