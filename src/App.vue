<template>
  <div class="flex min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
    
    <transition name="slide-down">
      <div v-if="!isOnline" class="fixed top-0 left-0 w-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-2 text-center z-[200] shadow-lg">
        ⚠️ Mode Offline: Data disimpan secara lokal & sinkron otomatis saat online
      </div>
    </transition>

    <template v-if="$route.name !== 'Login'">
      <transition name="fade">
        <div v-if="isNavOpen" 
          class="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md lg:hidden"
          @click="isNavOpen = false">
        </div>
      </transition>

      <aside 
        :class="isNavOpen ? 'translate-x-0' : '-translate-x-full'"
        class="fixed lg:static lg:translate-x-0 inset-y-0 left-0 z-[101] w-72 bg-white shadow-[25px_0_50px_-15px_rgba(0,0,0,0.1)] lg:shadow-none transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] p-6 rounded-r-[3rem] lg:rounded-none border-r border-slate-100 shrink-0">
        
        <div class="flex flex-col h-full">
          <div class="mb-10 px-2 pt-4">
            <div class="flex items-center gap-4">
              <div class="shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div class="flex flex-col">
                <h2 class="text-xl font-black tracking-tighter uppercase text-slate-800">Mekkah</h2>
                <span class="text-blue-600 tracking-[0.2em] text-[10px] font-bold uppercase -mt-1">Inventory</span>
              </div>
            </div>
          </div>

          <nav class="flex-1 space-y-3 overflow-y-auto no-scrollbar">
            <router-link 
              v-for="item in filteredMenu" :key="item.path" :to="item.path" 
              @click="isNavOpen = false"
              class="flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 group"
              :class="$route.path === item.path ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'"
            >
              <div class="shrink-0">
                <svg v-if="item.name === 'Dashboard'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                <svg v-else-if="item.name === 'Daftar Produk'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                <svg v-else-if="item.name === 'Tambah Produk'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <svg v-else-if="item.name === 'Kategori'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 11h.01M7 15h.01M13 7h.01M13 11h.01M13 15h.01M17 7h.01M17 11h.01M17 15h.01" /></svg>
                <svg v-else-if="item.name === 'Manage Staff'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <span>{{ item.name }}</span>
            </router-link>
            
            <button @click="handleLogout" class="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all mt-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1l-3 3H7a2 2 0 01-2-2V5a2 2 0 012-2h3l3 3v1" />
              </svg>
              <span>Keluar</span>
            </button>
          </nav>

          <div class="pt-6 border-t border-slate-50 text-center">
            <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Version 1.0.2 • Offline Ready</p>
          </div>
        </div>
      </aside>
    </template>

    <div class="flex-1 flex flex-col min-w-0 min-h-screen">
      <header v-if="$route.name !== 'Login'" 
        class="fixed top-0 z-50 bg-slate-50/80 backdrop-blur-xl px-5 py-4 flex items-center justify-between border-b border-slate-200/50 transition-all duration-300"
        :class="[
          $route.name !== 'Login' ? 'w-full lg:w-[calc(100%-18rem)]' : 'w-full',
          !isOnline ? 'mt-8' : 'mt-0'
        ]">
        
        <div class="flex items-center gap-4">
          <button @click="isNavOpen = true" class="lg:hidden p-3 bg-white shadow-md rounded-2xl text-slate-800 active:scale-90 transition-all border border-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <h1 class="font-black text-slate-800 uppercase tracking-tighter text-lg lg:text-xl">Toko Mekkah</h1>
        </div>
        
        <div class="flex items-center gap-3">
          <span class="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {{ isOnline ? 'Sistem Aktif' : 'Mode Offline' }}
          </span>
          <div :class="isOnline ? 'bg-green-500 shadow-green-200 animate-pulse' : 'bg-orange-500 shadow-orange-200'" class="w-3 h-3 rounded-full shadow-lg"></div>
        </div>
      </header>

      <main :class="$route.name !== 'Login' ? 'pt-28 pb-10 px-4 md:px-8' : ''" class="flex-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { auth } from './firebase/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const isNavOpen = ref(false)
const isOnline = ref(window.navigator.onLine)
const router = useRouter()

// Fungsi update status koneksi
const updateOnlineStatus = () => {
  isOnline.value = window.navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})

const handleLogout = async () => {
  if (confirm('Apakah Anda ingin keluar?')) {
    await signOut(auth)
    localStorage.clear()
    router.push('/login')
  }
}

const menuItems = [
  { name: 'Dashboard', path: '/', adminOnly: false },
  { name: 'Daftar Produk', path: '/produk', adminOnly: false },
  { name: 'Tambah Produk', path: '/tambah-produk', adminOnly: true },
  { name: 'Kategori', path: '/kategori', adminOnly: true },
  { name: 'Manage Staff', path: '/manage-users', adminOnly: true },
]

const filteredMenu = computed(() => {
  const role = localStorage.getItem('userRole')
  return menuItems.filter(item => {
    if (item.adminOnly && role !== 'admin') return false
    return true
  })
})
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { transform: translateY(-100%); }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

body { -webkit-font-smoothing: antialiased; }
</style>