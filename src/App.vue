<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans">
    
    <transition name="fade">
      <div v-if="isNavOpen" 
        class="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md"
        @click="isNavOpen = false">
      </div>
    </transition>

    <aside 
      :class="isNavOpen ? 'translate-x-0' : '-translate-x-full'"
      class="fixed inset-y-0 left-0 z-[101] w-72 bg-white shadow-[25px_0_50px_-15px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] p-6 rounded-r-[3rem] border-r border-slate-100">
      
      <div class="flex flex-col h-full">
        <div class="mb-10 px-2 pt-4">
  <div class="flex items-center gap-4">
    <div class="shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 shadow-opacity-50">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>
    
    <div class="flex flex-col">
      <h2 class="text-xl font-black tracking-tighter uppercase leading-tight text-slate-800">
        Mekkah
      </h2>
      <span class="text-blue-600 tracking-[0.2em] text-[10px] font-bold uppercase -mt-1">
        Inventory
      </span>
    </div>
  </div>
</div>

        <nav class="flex-1 space-y-3">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path" 
            @click="isNavOpen = false"
            class="flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 group"
            :class="$route.path === item.path 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-2' 
              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'"
          >
            <div :class="$route.path === item.path ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'">
              <component :is="item.icon" class="h-6 w-6" />
            </div>
            <span class="tracking-tight">{{ item.name }}</span>
          </router-link>
        </nav>

        <div class="pt-6 border-t border-slate-50 text-center">
          <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Version 1.0.2</p>
        </div>
      </div>
    </aside>

    <header class="fixed top-0 inset-x-0 z-50 bg-slate-50/80 backdrop-blur-xl px-5 py-4 flex items-center justify-between border-b border-slate-200/50">
      <div class="flex items-center gap-4">
        <button @click="isNavOpen = true" class="p-3 bg-white shadow-md rounded-2xl text-slate-800 active:scale-90 transition-all border border-slate-100 hover:bg-slate-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
        <h1 class="font-black text-slate-800 uppercase tracking-tighter text-lg">Toko Mekkah</h1>
      </div>
      <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-200"></div>
    </header>

    <main class="pt-28 pb-10 min-h-screen">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, markRaw } from 'vue'
import { useInventoryStore } from './stores/inventory'

// Icon components (Bisa pakai SVG langsung atau Heroicons)
const isNavOpen = ref(false)
const store = useInventoryStore()

onMounted(() => {
  store.fetchItems()
})

const menuItems = [
  { name: 'Dashboard', path: '/', icon: 'svg-dashboard' },
  { name: 'Daftar Produk', path: '/produk', icon: 'svg-produk' },
  { name: 'Tambah Produk', path: '/tambah-produk', icon: 'svg-tambah' },
  { name: 'Kategori Produk', path: '/kategori', icon: 'svg-kategori' },
]
</script>

<style>
/* Animasi Overlay */
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Custom Font Smoothing */
body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
</style>