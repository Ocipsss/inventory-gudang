import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(auth, (user) => {
      removeListener();
      resolve(user);
    }, reject);
  });
};

const routes = [
  { path: '/', name: 'Dashboard', component: () => import('../views/Dashboard.vue'), meta: { requiresAuth: true, adminOnly: false } },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/produk', name: 'ProductList', component: () => import('../views/ProductList.vue'), meta: { requiresAuth: true } },
  { path: '/tambah-produk', name: 'AddProduct', component: () => import('../views/AddProduct.vue'), meta: { requiresAuth: true, adminOnly: true } },
  { path: '/kategori', name: 'Kategori', component: () => import('../views/Kategori.vue'), meta: { requiresAuth: true, adminOnly: true } },
  { path: '/manage-users', name: 'ManageUsers', component: () => import('../views/ManageUsers.vue'), meta: { requiresAuth: true, adminOnly: true } },
  { path: '/add-user', name: 'AddUser', component: () => import('../views/AddUsers.vue'), meta: { requiresAuth: true, adminOnly: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser();
  const role = localStorage.getItem('userRole');

  if (to.meta.requiresAuth && !user) {
    next('/login');
  } else if (to.meta.adminOnly && role !== 'admin') {
    alert('Akses Ditolak: Khusus Admin');
    next('/produk'); // Staff dilempar ke produk saja
  } else {
    next();
  }
})

export default router