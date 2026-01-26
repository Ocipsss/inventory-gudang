<template>
  <button 
    v-if="!isOpen && isNotLoginPage"
    @click="isOpen = true"
    class="fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-all"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>

  <div 
    v-if="isOpen && isNotLoginPage" 
    @click="isOpen = false" 
    class="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
  ></div>

  <aside 
    class="fixed top-0 left-0 h-screen bg-slate-900 text-white z-50 transition-transform duration-300 ease-in-out w-64 flex flex-col shadow-2xl"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="p-6 flex justify-between items-center border-b border-slate-800">
      <div>
        <h1 class="text-xl font-bold text-blue-400 leading-none">TOKO MEKKAH</h1>
        <p class="text-[10px] text-slate-500 tracking-widest mt-2 uppercase font-semibold">Inventory System</p>
      </div>
      <button @click="isOpen = false" class="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <nav class="flex-1 px-4 space-y-2 mt-6">
      <router-link 
        @click="closeOnMobile" to="/" 
        class="flex items-center p-3 rounded-xl transition duration-200 text-slate-300 hover:bg-slate-800"
        active-class="bg-blue-600 text-white shadow-lg shadow-blue-900/40 font-semibold"
      >
        <span>Dashboard</span>
      </router-link>

      <router-link 
        @click="closeOnMobile" to="/produk" 
        class="flex items-center p-3 rounded-xl transition duration-200 text-slate-300 hover:bg-slate-800"
        active-class="bg-blue-600 text-white shadow-lg shadow-blue-900/40 font-semibold"
      >
        <span>Stok Barang</span>
      </router-link>

      <router-link 
        @click="closeOnMobile" to="/produk/tambah" 
        class="flex items-center p-3 rounded-xl transition duration-200 text-slate-300 hover:bg-slate-800"
        active-class="bg-blue-600 text-white shadow-lg shadow-blue-900/40 font-semibold"
      >
        <span>Tambah Barang</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-slate-800">
      <button @click="logout" class="w-full flex items-center p-3 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-all group">
        <span class="font-medium">Keluar Akun</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { auth } from '../firebase/firebase'
import { signOut } from 'firebase/auth'
import { useRouter, useRoute } from 'vue-router'

const isOpen = ref(true)
const router = useRouter()
const route = useRoute()

const isNotLoginPage = computed(() => route.path !== '/login')

const closeOnMobile = () => {
  if (window.innerWidth < 768) {
    isOpen.value = false
  }
}

const logout = () => {
  if(confirm('Yakin ingin keluar?')) {
    signOut(auth).then(() => router.push('/login'))
  }
}
</script>