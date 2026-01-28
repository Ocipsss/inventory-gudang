import { createRouter, createWebHistory } from 'vue-router'
// 1. Import auth dari konfigurasi firebase Anda
import { auth } from '../firebase/firebase'

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

// 2. Tambahkan Navigation Guard (beforeEach) di sini
router.beforeEach((to, from, next) => {
  const requiresAuth = to.name !== 'Login'
  const isAuthenticated = auth.currentUser

  if (requiresAuth && !isAuthenticated) {
    // Jika butuh login tapi user belum login, lempar ke halaman Login
    next({ name: 'Login' })
  } else if (to.name === 'Login' && isAuthenticated) {
    // Tambahan opsional: Jika sudah login tapi mau ke page Login, lempar ke Dashboard
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

// 3. Logika untuk mengubah judul halaman
router.afterEach((to) => {
  document.title = to.meta.title || 'Mekkah Stock'
})

export default router