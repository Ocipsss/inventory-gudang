<template>
  <div class="max-w-md mx-auto pb-20 px-2">
    <div class="mb-6 px-1">
      <h1 class="text-2xl font-black text-slate-800 tracking-tight">Stok Barang</h1>
      <p class="text-slate-500 text-xs font-medium italic uppercase tracking-widest">Akses: {{ userRole }}</p>
    </div>

    <div class="relative mb-4">
      <input v-model="searchQuery" type="text" placeholder="Cari barang..." class="w-full bg-white border-none p-4 pl-12 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 font-medium text-sm transition-all" />
    </div>

    <div class="flex overflow-x-auto gap-2 pb-6 px-1 no-scrollbar">
      <button @click="selectedCategory = 'Semua'" :class="selectedCategory === 'Semua' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'" class="px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap">Semua</button>
      <button v-for="cat in store.categories" :key="cat.id" @click="selectedCategory = cat.name" :class="selectedCategory === cat.name ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'" class="px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap">{{ cat.name }}</button>
    </div>

    <div class="space-y-3">
      <div v-for="item in filteredItems" :key="item.id" class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center transition-all">
        <div class="flex-1 min-w-0 pr-4">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[9px] font-black px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full uppercase">{{ item.kategori }}</span>
          </div>
          <h3 class="font-bold text-slate-800 truncate uppercase text-sm leading-tight">{{ item.nama }}</h3>
          <p class="text-[11px] text-slate-500 font-bold text-orange-600 mt-1">Stok: {{ item.stok }}</p>
        </div>

        <div class="text-right shrink-0">
          <div class="text-sm font-black text-slate-900 mb-2">Rp{{ item.hargaJual?.toLocaleString() }}</div>
          
          <div v-if="userRole === 'admin'" class="flex gap-1">
            <button @click="openEditModal(item)" class="p-2 bg-blue-50 text-blue-600 rounded-xl active:scale-90 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button @click="confirmDelete(item)" class="p-2 bg-red-50 text-red-500 rounded-xl active:scale-90 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>

          <div v-else class="flex flex-col items-end">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lokasi</span>
            <div class="text-[11px] text-slate-600 font-black uppercase">{{ item.lokasi || 'Rak Umum' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen && userRole === 'admin'" class="fixed inset-0 z-[60] flex items-end justify-center">
      <div class="fixed inset-0 bg-slate-900/60" @click="isModalOpen = false"></div>
      <div class="relative bg-white w-full max-w-lg rounded-t-[2.5rem] p-8">
        <form @submit.prevent="updateBarang" class="space-y-4">
          <h2 class="font-black mb-4 uppercase tracking-tighter">Edit Stok: {{ editForm.nama }}</h2>
          <input v-model.number="editForm.stok" type="number" class="w-full bg-orange-50 p-4 rounded-2xl font-black text-orange-600 outline-none" />
          <button type="submit" class="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest shadow-lg">Simpan Perubahan</button>
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
const editForm = ref({ nama: '', stok: 0 })

const filteredItems = computed(() => {
  let items = store.items || []
  if (selectedCategory.value !== 'Semua') items = items.filter(i => i.kategori === selectedCategory.value)
  if (searchQuery.value) items = items.filter(i => i.nama?.toLowerCase().includes(searchQuery.value.toLowerCase()))
  return items
})

onMounted(() => store.fetchItems())

const openEditModal = (item) => {
  currentId.value = item.id
  editForm.value = { ...item }
  isModalOpen.value = true
}

const updateBarang = async () => {
  await store.updateItem(currentId.value, editForm.value)
  isModalOpen.value = false
}

const confirmDelete = (item) => {
  if (confirm(`Hapus ${item.nama}?`)) store.deleteItem(item.id)
}
</script>