<template>
  <div class="max-w-7xl mx-auto pb-20 px-4">
    <div class="mb-10 lg:mb-12">
      <h1 class="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Ringkasan Gudang</h1>
      <div class="flex items-center gap-2 mt-2">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <p class="text-slate-500 text-xs font-bold uppercase tracking-widest italic">Data Terkini (Real-time)</p>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
      
      <div class="bg-blue-600 p-6 lg:p-8 rounded-[2.5rem] shadow-xl shadow-blue-100 text-white relative overflow-hidden group">
        <div class="relative z-10">
          <div class="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-2">Total Jenis</div>
          <div class="text-3xl lg:text-5xl font-black">{{ store.items.length }}</div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 absolute -right-4 -bottom-4 opacity-20 transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>

      <div class="bg-orange-500 p-6 lg:p-8 rounded-[2.5rem] shadow-xl shadow-orange-100 text-white relative overflow-hidden group">
        <div class="relative z-10">
          <div class="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-2">Total Unit</div>
          <div class="text-3xl lg:text-5xl font-black">{{ totalStok }}</div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 absolute -right-4 -bottom-4 opacity-20 transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>

      <div v-if="userRole === 'admin'" class="col-span-2 bg-white p-6 lg:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex items-center justify-between group overflow-hidden relative">
        <div class="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-0"></div>
        <div class="relative z-10">
          <div class="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Estimasi Nilai Modal</div>
          <div class="text-3xl lg:text-4xl font-black text-slate-800 tracking-tighter">Rp{{ totalModal.toLocaleString() }}</div>
        </div>
        <div class="bg-green-500 p-5 rounded-3xl text-white shadow-lg shadow-green-100 relative z-10 transform group-hover:rotate-12 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-6 px-2">
          <h2 class="text-sm lg:text-base font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
            <span class="p-2 bg-red-100 text-red-600 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            Stok Hampir Habis
          </h2>
          <span class="text-[10px] font-bold text-red-400 bg-red-50 px-3 py-1 rounded-full">Limit &lt; 5 Unit</span>
        </div>

        <div v-if="lowStockItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="item in lowStockItems" :key="item.id" 
            class="bg-white p-5 rounded-[2rem] border border-slate-50 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">{{ item.kategori }}</span>
              <h3 class="font-bold text-slate-800 text-sm lg:text-base uppercase">{{ item.nama }}</h3>
            </div>
            <div class="bg-red-50 text-red-600 h-12 w-12 flex items-center justify-center rounded-2xl font-black text-lg">
              {{ item.stok }}
            </div>
          </div>
        </div>

        <div v-else class="bg-white border-2 border-dashed border-slate-100 p-16 rounded-[3rem] text-center">
          <div class="text-5xl mb-4 animate-bounce">🎉</div>
          <h3 class="text-slate-800 font-black uppercase text-lg">Semua Aman!</h3>
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Tidak ada stok di bawah limit.</p>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="font-black uppercase tracking-widest text-sm mb-4">Tips Kelola</h3>
            <ul class="text-xs space-y-4 opacity-80 font-medium leading-relaxed">
              <li class="flex gap-3">
                <span class="text-blue-400">●</span> 
                Update harga modal secara berkala untuk menjaga akurasi total aset.
              </li>
              <li class="flex gap-3">
                <span class="text-orange-400">●</span> 
                Gunakan fitur Kategori untuk mempermudah pencarian barang di gudang.
              </li>
            </ul>
          </div>
          <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useInventoryStore } from '../stores/inventory'

const store = useInventoryStore()
const userRole = ref(localStorage.getItem('userRole'))

onMounted(() => {
  store.fetchItems()
})

const totalStok = computed(() => {
  return (store.items || []).reduce((sum, item) => sum + (Number(item.stok) || 0), 0)
})

const totalModal = computed(() => {
  return (store.items || []).reduce((sum, item) => sum + ((Number(item.stok) || 0) * (Number(item.hargaModal) || 0)), 0)
})

const lowStockItems = computed(() => {
  return (store.items || []).filter(item => (Number(item.stok) || 0) < 5)
})
</script>