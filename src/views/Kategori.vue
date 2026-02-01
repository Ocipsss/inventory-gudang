<template>
  <div class="max-w-md mx-auto pb-20 px-4">
    <div class="flex items-center gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight">Kategori Produk</h1>
        <p class="text-slate-500 text-xs font-medium">Kelola pengelompokan barang</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 mb-8">
      <h2 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
        Tambah Kategori
      </h2>

      <div class="flex gap-2 mb-6">
        <input 
          v-model="newCat" 
          @keyup.enter="handleAdd"
          type="text" 
          placeholder="Nama kategori..." 
          class="flex-1 bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm transition-all outline-none"
        />
        <button 
          @click="handleAdd"
          class="bg-blue-600 text-white px-5 rounded-2xl font-black active:scale-90 transition-all shadow-lg shadow-blue-200"
        >
          +
        </button>
      </div>

      <div class="space-y-2">
        <div v-for="cat in store.categories" :key="cat.id" 
          class="flex justify-between items-center p-4 bg-slate-50 rounded-2xl group border border-transparent hover:border-slate-100 transition-all">
          <span class="font-bold text-slate-700 uppercase text-xs tracking-wider">{{ cat.name }}</span>
          
          <button @click="handleDelete(cat)" class="text-slate-300 hover:text-red-500 transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div v-if="store.loading" class="text-center py-4 text-slate-400 text-xs animate-pulse">
          Memuat kategori...
        </div>
      </div>
    </div>

    <div class="p-5 bg-orange-50 rounded-3xl border border-orange-100 text-orange-700">
      <p class="text-[10px] font-bold leading-relaxed tracking-tight uppercase opacity-80 mb-1">Catatan</p>
      <p class="text-xs font-medium italic leading-relaxed">
        Menghapus kategori tidak akan menghapus barang yang sudah ada, namun kategori tersebut tidak akan muncul lagi di pilihan "Tambah Barang".
      </p>
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