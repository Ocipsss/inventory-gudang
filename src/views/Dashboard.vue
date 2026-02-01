<template>
  <div class="max-w-md mx-auto pb-20 px-2">
    <div class="mb-8 px-1">
      <h1 class="text-2xl font-black text-slate-800 tracking-tight">Ringkasan Gudang</h1>
      <p class="text-slate-500 text-xs font-medium italic">Update otomatis (Real-time)</p>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-blue-600 p-5 rounded-[2.5rem] shadow-xl shadow-blue-200 text-white relative overflow-hidden group">
        <div class="relative z-10">
          <div class="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Jenis</div>
          <div class="text-3xl font-black">{{ store.items.length }}</div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 absolute -right-2 -bottom-2 opacity-20 transform group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>

      <div class="bg-orange-500 p-5 rounded-[2.5rem] shadow-xl shadow-orange-200 text-white relative overflow-hidden group">
        <div class="relative z-10">
          <div class="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Unit</div>
          <div class="text-3xl font-black">{{ totalStok }}</div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 absolute -right-2 -bottom-2 opacity-20 transform group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>

      <div v-if="userRole === 'admin'" class="col-span-2 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimasi Nilai Modal</div>
          <div class="text-2xl font-black text-slate-800 tracking-tighter">Rp{{ totalModal.toLocaleString() }}</div>
        </div>
        <div class="bg-green-100 p-4 rounded-3xl text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <div class="flex items-center justify-between mb-4 px-2">
        <h2 class="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <span class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Stok Hampir Habis
        </h2>
        <span class="text-[10px] font-bold text-slate-400 italic">Limit: &lt; 5 unit</span>
      </div>

      <div v-if="lowStockItems.length > 0" class="space-y-3">
        <div v-for="item in lowStockItems" :key="item.id" 
          class="bg-white p-4 rounded-3xl border border-red-50 flex items-center justify-between shadow-sm">
          <div class="flex flex-col">
            <span class="text-[9px] font-bold text-red-500 uppercase tracking-tighter mb-1">{{ item.kategori }}</span>
            <h3 class="font-bold text-slate-800 text-sm uppercase">{{ item.nama }}</h3>
          </div>
          <div class="bg-red-50 text-red-600 px-4 py-2 rounded-2xl font-black text-sm">
            {{ item.stok }}
          </div>
        </div>
      </div>

      <div v-else class="bg-slate-50 border-2 border-dashed border-slate-100 p-10 rounded-[2.5rem] text-center">
        <div class="text-3xl mb-2">🎉</div>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Semua Stok Aman</p>
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