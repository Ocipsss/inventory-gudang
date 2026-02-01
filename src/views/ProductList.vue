<template>
  <div class="max-w-md mx-auto pb-20 px-2">
    <div class="mb-6 px-1">
      <h1 class="text-2xl font-black text-slate-800 tracking-tight">Stok Barang</h1>
      <p class="text-slate-500 text-xs font-medium italic uppercase tracking-widest">Akses: {{ userRole }}</p>
    </div>

    <div class="relative mb-4">
      <input v-model="searchQuery" type="text" placeholder="Cari barang..." class="w-full bg-white border-none p-4 pl-12 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 font-medium text-sm transition-all" />
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <div class="flex overflow-x-auto gap-2 pb-6 px-1 no-scrollbar">
      <button @click="selectedCategory = 'Semua'" :class="selectedCategory === 'Semua' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'" class="px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap">Semua</button>
      <button v-for="cat in store.categories" :key="cat.id" @click="selectedCategory = cat.name" :class="selectedCategory === cat.name ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'" class="px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap">{{ cat.name }}</button>
    </div>

    <div class="space-y-3">
      <div v-for="item in filteredItems" :key="item.id" 
           @click="openDetailModal(item)"
           class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center transition-all active:scale-[0.98] cursor-pointer">
        <div class="flex-1 min-w-0 pr-4">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[9px] font-black px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full uppercase">{{ item.kategori }}</span>
          </div>
          <h3 class="font-bold text-slate-800 truncate uppercase text-sm leading-tight">{{ item.nama }}</h3>
          <p class="text-[11px] text-slate-500 font-bold text-orange-600 mt-1">Stok: {{ item.stok }}</p>
        </div>

        <div class="text-right shrink-0">
          <div class="text-sm font-black text-slate-900 mb-2">Rp{{ item.hargaJual?.toLocaleString() }}</div>
          
          <div class="flex gap-1 justify-end">
            <div class="p-2 bg-slate-50 text-slate-400 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <button v-if="userRole === 'admin'" @click.stop="confirmDelete(item)" class="p-2 bg-red-50 text-red-500 rounded-xl active:scale-90 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-[110] flex items-end justify-center p-0">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="isModalOpen = false"></div>
      <div class="relative bg-white w-full max-w-lg rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>

        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="font-black text-slate-800 text-xl uppercase tracking-tighter">Detil Produk</h2>
            <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">{{ userRole === 'admin' ? 'Mode Edit' : 'Mode Lihat Saja' }}</p>
          </div>
          <button @click="isModalOpen = false" class="p-2 bg-slate-100 rounded-full text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form @submit.prevent="updateBarang" class="space-y-4">
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Nama Barang</label>
            <input v-model="editForm.nama" :disabled="userRole !== 'admin'" type="text" class="w-full mt-1 bg-slate-50 p-4 rounded-2xl font-bold text-sm border-2 border-transparent focus:border-blue-500 outline-none disabled:opacity-70" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Harga Beli</label>
              <input v-model.number="editForm.hargaModal" :disabled="userRole !== 'admin'" type="number" class="w-full mt-1 bg-slate-50 p-4 rounded-2xl font-bold text-sm border-2 border-transparent focus:border-blue-500 outline-none disabled:opacity-70" />
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Harga Jual</label>
              <input v-model.number="editForm.hargaJual" :disabled="userRole !== 'admin'" type="number" class="w-full mt-1 bg-slate-50 p-4 rounded-2xl font-bold text-sm border-2 border-transparent focus:border-blue-500 outline-none disabled:opacity-70" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Stok Saat Ini</label>
              <input v-model.number="editForm.stok" :disabled="userRole !== 'admin'" type="number" class="w-full mt-1 bg-orange-50 p-4 rounded-2xl font-black text-orange-600 border-2 border-transparent focus:border-blue-500 outline-none disabled:opacity-70" />
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Lokasi Rak</label>
              <input v-model="editForm.lokasi" :disabled="userRole !== 'admin'" type="text" placeholder="Gudang A" class="w-full mt-1 bg-slate-50 p-4 rounded-2xl font-bold text-sm border-2 border-transparent focus:border-blue-500 outline-none disabled:opacity-70" />
            </div>
          </div>

          <button v-if="userRole === 'admin'" type="submit" class="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all mt-4">
            Simpan Perubahan
          </button>
          
          <button v-else @click="isModalOpen = false" type="button" class="w-full bg-slate-100 text-slate-600 py-5 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all mt-4">
            Tutup
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useInventoryStore } from '../stores/inventory'

const store = useInventoryStore()
const userRole = ref(localStorage.getItem('userRole'))
const searchQuery = ref('')
const selectedCategory = ref('Semua')
const isModalOpen = ref(false)
const currentId = ref(null)
const editForm = ref({ nama: '', stok: 0, hargaModal: 0, hargaJual: 0, lokasi: '', kategori: '' })

const filteredItems = computed(() => {
  let items = store.items || []
  if (selectedCategory.value !== 'Semua') items = items.filter(i => i.kategori === selectedCategory.value)
  if (searchQuery.value) items = items.filter(i => i.nama?.toLowerCase().includes(searchQuery.value.toLowerCase()))
  return items
})

onMounted(() => store.fetchItems())

const openDetailModal = (item) => {
  currentId.value = item.id
  // Copy semua data produk ke form edit
  editForm.value = { ...item }
  isModalOpen.value = true
}

const updateBarang = async () => {
  if (userRole.value !== 'admin') return
  await store.updateItem(currentId.value, editForm.value)
  isModalOpen.value = false
}

const confirmDelete = (item) => {
  if (confirm(`Hapus ${item.nama}?`)) store.deleteItem(item.id)
}
</script>