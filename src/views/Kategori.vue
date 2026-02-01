<template>
  <div class="max-w-6xl mx-auto pb-20 px-4">
    <div class="mb-10 lg:mb-12 text-left">
      <h1 class="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Kategori Produk</h1>
      <p class="text-slate-500 text-sm font-medium mt-1">Kelola pengelompokan barang untuk mempermudah inventarisir</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white p-8 lg:p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-50">
          <h2 class="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <span class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
            Tambah Kategori Baru
          </h2>

          <div class="space-y-4">
            <div class="relative">
              <input 
                v-model="newCat" 
                @keyup.enter="handleAdd"
                type="text" 
                placeholder="Nama kategori (ex: Mukena)" 
                class="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-5 rounded-2xl font-bold text-sm transition-all outline-none"
              />
            </div>
            
            <button 
              @click="handleAdd"
              :disabled="!newCat.trim()"
              class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 disabled:bg-slate-200 disabled:shadow-none transition-all"
            >
              Simpan Kategori
            </button>
          </div>

          <div class="mt-8 pt-8 border-t border-slate-50">
            <div class="flex gap-3 text-orange-600 bg-orange-50 p-4 rounded-2xl border border-orange-100/50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-[11px] font-medium leading-relaxed italic">
                Menghapus kategori tidak akan menghilangkan produk yang sudah terdaftar, namun kategori tersebut tidak bisa dipilih lagi nantinya.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7">
        <div class="bg-white p-8 lg:p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-50 min-h-[300px]">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Daftar Kategori Aktif</h2>
            <span class="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{{ store.categories.length }} Total</span>
          </div>

          <div v-if="store.loading" class="flex flex-col items-center justify-center py-20 text-slate-300">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p class="text-xs font-bold uppercase tracking-widest">Sinkronisasi Data...</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-for="cat in store.categories" :key="cat.id" 
              class="flex justify-between items-center p-5 bg-slate-50/50 rounded-2xl group border-2 border-transparent hover:border-blue-100 hover:bg-white transition-all duration-300">
              <span class="font-bold text-slate-700 uppercase text-xs tracking-wider truncate mr-4">{{ cat.name }}</span>
              
              <button @click="handleDelete(cat)" class="opacity-0 group-hover:opacity-100 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition-all p-2 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="!store.loading && store.categories.length === 0" class="text-center py-20">
            <div class="text-4xl mb-4 opacity-20">📂</div>
            <p class="text-slate-400 text-xs font-black uppercase tracking-widest">Belum ada kategori</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInventoryStore } from '../stores/inventory'

const store = useInventoryStore()
const newCat = ref('')

onMounted(() => {
  store.fetchItems() 
})

const handleAdd = async () => {
  if (!newCat.value.trim()) return
  try {
    await store.addCategory(newCat.value.trim())
    newCat.value = ''
  } catch (e) {
    alert("Gagal menambah kategori")
  }
}

const handleDelete = async (cat) => {
  if (confirm(`Hapus kategori "${cat.name}"?`)) {
    try {
      await store.removeCategory(cat.id)
    } catch (e) {
      alert("Gagal menghapus kategori")
    }
  }
}
</script>