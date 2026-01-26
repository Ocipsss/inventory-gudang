import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: 'Dashboard - Mekkah Stock' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/produk',
    name: 'ProductList',
    component: () => import('../views/ProductList.vue'),
    meta: { title: 'Daftar Stok' }
  },
  {
    path: '/tambah-produk',
    name: 'AddProduct',
    component: () => import('../views/AddProduct.vue'),
    meta: { title: 'Tambah Produk' }
  },
  {
    path: '/kategori',
    name: 'Kategori',
    component: () => import('../views/Settings.vue'),
    meta: { title: 'Kelola Kategori' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})
router.afterEach((to) => {
  document.title = to.meta.title || 'Mekkah Stock'
})

export default router