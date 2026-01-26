<template>
  <div class="max-w-md mx-auto pb-20 px-2">
    <div class="mb-8">
      <h1 class="text-2xl font-black text-slate-800 tracking-tight">Ringkasan Gudang</h1>
      <p class="text-slate-500 text-xs font-medium">Data diperbarui secara real-time</p>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="bg-blue-600 p-5 rounded-[2rem] shadow-xl shadow-blue-200 text-white">
        <div class="bg-blue-400/30 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div class="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Jenis</div>
        <div class="text-3xl font-black">{{ store.items.length }}</div>
      </div>

      <div class="bg-orange-500 p-5 rounded-[2rem] shadow-xl shadow-orange-200 text-white">
        <div class="bg-orange-400/30 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div class="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Unit</div>
        <div class="text-3xl font-black">{{ totalStok }}</div>
      </div>

      <div class="col-span-2 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimasi Nilai Modal</div>
          <div class="text-2xl font-black text-slate-800">Rp{{ totalModal.toLocaleString() }}</div>
        </div>
        <div class="bg-green-100 p-3 rounded-2xl text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h2 class="text-sm font-bold text-slate-800 mb-4 px-1">Menu Cepat</h2>
      <div class="space-y-3">
        <router-link to="/produk" class="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 shadow-sm active:scale-95 transition-all">
          <div class="flex items-center gap-4">
            <div class="bg-blue-50 p-2 rounded-lg text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </div>
            <span class="font-bold text-slate-700">Lihat Semua Stok</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>

        <router-link to="/produk/tambah" class="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 shadow-sm active:scale-95 transition-all">
          <div class="flex items-center gap-4">
            <div class="bg-green-50 p-2 rounded-lg text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span class="font-bold text-slate-700">Tambah Barang Baru</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
        <router-link to="/settings" class="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 shadow-sm active:scale-95 transition-all">
  <div class="flex items-center gap-4">
    <div class="bg-slate-100 p-2 rounded-lg text-slate-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
    <span class="font-bold text-slate-700">Pengaturan & Kategori</span>
  </div>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
  </svg>
</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useInventoryStore } from '../stores/inventory'

const store = useInventoryStore()

onMounted(() => {
  store.fetchItems()
})

// Logika menghitung total stok
const totalStok = computed(() => {
  return store.items.reduce((sum, item) => sum + (item.stok || 0), 0)
})

// Logika menghitung total modal (Stok x Harga Modal)
const totalModal = computed(() => {
  return store.items.reduce((sum, item) => sum + ((item.stok || 0) * (item.hargaModal || 0)), 0)
})
</script>