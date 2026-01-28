<template>
  <div class="max-w-md mx-auto pb-20 px-2">
    <div class="mb-6 px-1">
      <h1 class="text-2xl font-black text-slate-800 tracking-tight">Stok Barang</h1>
      <p class="text-slate-500 text-xs font-medium">Cari dan kelola stok gudang</p>
    </div>

    <div class="relative mb-4">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Cari nama barang atau kode..." 
        class="w-full bg-white border-none p-4 pl-12 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 font-medium text-sm transition-all"
      />
      <button v-if="searchQuery" @click="searchQuery = ''" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="flex overflow-x-auto gap-2 pb-6 px-1 no-scrollbar">
      <button 
        @click="selectedCategory = 'Semua'"
        :class="selectedCategory === 'Semua' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-500 border border-slate-100'"
        class="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap"
      >
        Semua
      </button>
      
      <button 
        v-for="cat in store.categories" 
        :key="cat.id"
        @click="selectedCategory = cat.name"
        :class="selectedCategory === cat.name ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-500 border border-slate-100'"
        class="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap"
      >
        {{ cat.name }}
      </button>
    </div>

    <div class="space-y-3">
      <div v-for="item in filteredItems" :key="item.id" 
        class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center active:scale-[0.98] transition-all">
        
        <div class="flex-1 min-w-0 pr-4">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[9px] font-black px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full uppercase italic tracking-tighter">
              {{ item.kategori }}
            </span>
            <span class="text-[10px] text-slate-400 font-mono">{{ item.kode }}</span>
          </div>
          <h3 class="font-bold text-slate-800 truncate uppercase text-sm leading-tight">{{ item.nama }}</h3>
          <div class="text-[11px] text-slate-500 mt-1 flex items-center">
             <span class="font-bold text-orange-600 mr-2">Stok: {{ item.stok }}</span>
             <span>{{ item.lokasi || 'Rak -' }}</span>
          </div>
        </div>

        <div class="text-right shrink-0">
          <div class="text-sm font-black text-slate-900 mb-2">
            Rp{{ item.hargaJual?.toLocaleString() }}
          </div>
          <div class="flex gap-1">
            <button @click="openEditModal(item)" class="p-2 bg-blue-50 text-blue-600 rounded-xl active:scale-90 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button @click="confirmDelete(item)" class="p-2 bg-red-50 text-red-500 rounded-xl active:scale-90 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
        <div class="text-4xl mb-2">🔍</div>
        <p class="text-slate-400 text-sm italic font-medium">Barang tidak ditemukan...</p>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="isModalOpen = false"></div>
      <div class="relative bg-white w-full max-w-lg rounded-t-[2.5rem] p-8 transition-all">
        <form @submit.prevent="updateBarang" class="space-y-4">
          <h2 class="text-lg font-black text-slate-800 uppercase mb-4">Edit Produk</h2>
          <input v-model="editForm.nama" type="text" class="w-full bg-slate-50 p-4 rounded-2xl font-bold" />
          
          <div class="grid grid-cols-2 gap-3">
            <select v-model="editForm.kategori" class="bg-slate-50 border-none p-4 rounded-2xl font-semibold outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="cat in store.categories" :key="cat.id" :value="cat.name">
                {{ cat.name }}
              </option>
            </select>
            <input v-model="editForm.lokasi" type="text" placeholder="Lokasi Rak" class="bg-slate-50 border-none p-4 rounded-2xl font-semibold" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <input v-model.number="editForm.hargaModal" type="number" min="0" placeholder="Harga Modal" class="bg-blue-50 p-4 rounded-2xl font-bold text-blue-600" />
            <input v-model.number="editForm.hargaJual" type="number" min="0" placeholder="Harga Jual" class="bg-green-50 p-4 rounded-2xl font-bold text-green-600" />
          </div>
          <input v-model.number="editForm.stok" type="number" min="0" placeholder="Stok" class="w-full bg-orange-50 p-4 rounded-2xl font-black text-orange-600" />

          <button type="submit" class="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all uppercase">
            SIMPAN PERUBAHAN
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Bagian script tetap sama seperti sebelumnya karena logic filteredItems sudah benar
// Selama item.kategori menyimpan string nama kategori, filter ini akan tetap jalan.
import { ref, onMounted, computed } from 'vue'
import { useInventoryStore } from '../stores/inventory'

const store = useInventoryStore()
const searchQuery = ref('')
const selectedCategory = ref('Semua')
const isModalOpen = ref(false)
const currentId = ref(null)
const editForm = ref({
  nama: '', kategori: '', lokasi: '', hargaModal: 0, hargaJual: 0, stok: 0
})

const filteredItems = computed(() => {
  let items = store.items || []

  if (selectedCategory.value !== 'Semua') {
    items = items.filter(item => item.kategori === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => 
      item.nama?.toLowerCase().includes(query) || 
      item.kode?.toLowerCase().includes(query)
    )
  }

  return items
})

onMounted(async () => {
  await store.fetchItems()
})

const openEditModal = (item) => {
  currentId.value = item.id
  editForm.value = { ...item }
  isModalOpen.value = true
}

const updateBarang = async () => {
  try {
    await store.updateItem(currentId.value, editForm.value)
    isModalOpen.value = false
    alert('✅ Terupdate!')
  } catch (error) {
    alert('❌ Gagal update')
  }
}

const confirmDelete = (item) => {
  if (confirm(`Hapus ${item.nama}?`)) {
    store.deleteItem(item.id)
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>