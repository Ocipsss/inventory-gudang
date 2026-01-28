import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Fungsi Helper untuk menunggu status auth dari Firebase
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: 'Dashboard - Mekkah Stock', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: 'Login', requiresAuth: false }
  },
  {
    path: '/produk',
    name: 'ProductList',
    component: () => import('../views/ProductList.vue'),
    meta: { title: 'Daftar Stok', requiresAuth: true }
  },
  {
    path: '/tambah-produk',
    name: 'AddProduct',
    component: () => import('../views/AddProduct.vue'),
    meta: { title: 'Tambah Produk', requiresAuth: true }
  },
  {
    path: '/kategori',
    name: 'Kategori',
    component: () => import('../views/Kategori.vue'),
    meta: { title: 'Kelola Kategori', requiresAuth: true }
  },
  {
  path: '/manage-users',
  name: 'ManageUsers',
  component: () => import('../views/ManageUsers.vue'),
  meta: { title: 'Tambah Staff', requiresAuth: true }
}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation Guard yang diperbaiki
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await getCurrentUser();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
})

router.afterEach((to) => {
  document.title = to.meta.title || 'Mekkah Stock'
})

export default router