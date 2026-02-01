<template>
  <div class="max-w-7xl mx-auto pb-20 px-4">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div>
        <h1 class="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Stok Barang</h1>
        <div class="flex items-center gap-2 mt-2">
          <span class="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-widest">
            Akses: {{ userRole }}
          </span>
          <span class="text-slate-400 text-xs font-medium">{{ filteredItems.length }} Produk ditemukan</span>
        </div>
      </div>

      <div class="relative w-full md:w-96 group">
        <input v-model="searchQuery" type="text" placeholder="Cari nama barang..." 
          class="w-full bg-white border-2 border-transparent focus:border-blue-500 p-4 pl-12 rounded-[1.5rem] shadow-xl shadow-slate-200/50 font-bold text-sm transition-all outline-none" />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <div class="lg:w-64 shrink-0 overflow-x-auto no-scrollbar py-1">
        <div class="flex lg:flex-col gap-2">
          <h2 class="hidden lg:block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Filter Kategori</h2>
          <button @click="selectedCategory = 'Semua'" 
            :class="selectedCategory === 'Semua' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'" 
            class="px-6 py-3 rounded-2xl text-[11px] font-black uppercase transition-all whitespace-nowrap text-left flex items-center justify-between">
            Semua Barang
            <span v-if="selectedCategory === 'Semua'" class="ml-2 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
          </button>
          <button v-for="cat in store.categories" :key="cat.id" @click="selectedCategory = cat.name" 
            :class="selectedCategory === cat.name ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'" 
            class="px-6 py-3 rounded-2xl text-[11px] font-black uppercase transition-all whitespace-nowrap text-left flex items-center justify-between">
            {{ cat.name }}
            <span v-if="selectedCategory === cat.name" class="ml-2 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
          </button>
        </div>
      </div>

      <div class="flex-1">
        <div v-if="filteredItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div v-for="item in filteredItems" :key="item.id" 
               @click="openDetailModal(item)"
               class="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/30 group hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden">
            
            <div class="mb-4">
              <span class="text-[9px] font-black px-3 py-1 bg-blue-50 text-blue-600 rounded-full uppercase tracking-widest">{{ item.kategori }}</span>
            </div>

            <div class="flex justify-between items-start">
              <div class="flex-1 min-w-0 pr-2">
                <h3 class="font-black text-slate-800 uppercase text-sm lg:text-base leading-tight group-hover:text-blue-600 transition-colors truncate">{{ item.nama }}</h3>
                <p class="text-[10px] font-bold text-blue-400 uppercase tracking-tighter mt-0.5">{{ item.penerbit || '-' }}</p>
                
                <div class="flex items-center gap-2 mt-3">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Lokasi:</span>
                  <span class="text-[10px] font-bold text-slate-600">{{ item.lokasi || 'Tidak ada rak' }}</span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs font-black text-slate-400 uppercase tracking-tighter">Stok</div>
                <div :class="item.stok < 5 ? 'text-red-500' : 'text-orange-500'" class="text-2xl font-black leading-none mt-1">{{ item.stok }}</div>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div class="text-base font-black text-slate-900 tracking-tight">Rp{{ item.hargaJual?.toLocaleString() }}</div>
              
              <div class="flex gap-2">
                <div class="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <button v-if="userRole === 'admin'" @click.stop="confirmDelete(item)" class="p-2 bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-all active:scale-90">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
          <div class="text-5xl mb-4">🔍</div>
          <h3 class="text-slate-800 font-black uppercase">Produk tidak ditemukan</h3>
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Coba kata kunci lain atau periksa kategori</p>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300" @click="isModalOpen = false"></div>
      <div class="relative bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
        
        <div class="flex justify-between items-start mb-8">
          <div>
            <h2 class="font-black text-slate-800 text-2xl uppercase tracking-tighter">Detil Produk</h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
              <p class="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{{ editForm.kode }}</p>
            </div>
          </div>
          <button @click="isModalOpen = false" class="p-3 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form @submit.prevent="updateBarang" class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="md:col-span-2">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Nama Barang</label>
            <input v-model="editForm.nama" :disabled="userRole !== 'admin'" type="text" class="w-full mt-1.5 bg-slate-50 p-4 rounded-2xl font-bold text-sm border-2 border-transparent focus:border-blue-500 outline-none disabled:opacity-70 disabled:cursor-not-allowed" />
          </div>

          <div class="md:col-span-2">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Penerbit</label>
            <input v-model="editForm.penerbit" :disabled="userRole !== 'admin'" type="text" class="w-full mt-1.5 bg-slate-50 p-4 rounded-2xl font-bold text-sm border-2 border-transparent focus:border-blue-500 outline-none disabled:opacity-70 disabled:cursor-not-allowed" />
          </div>

          <div>
            <label class="text-[10px] font-black text-blue-400 uppercase ml-1 tracking-widest">Harga Modal</label>
            <input v-model.number="editForm.hargaModal" :disabled="userRole !== 'admin'" type="number" class="w-full mt-1.5 bg-blue-50/50 p-4 rounded-2xl font-bold text-sm text-blue-600 outline-none disabled:opacity-70" />
          </div>
          <div>
            <label class="text-[10px] font-black text-green-500 uppercase ml-1 tracking-widest">Harga Jual</label>
            <input v-model.number="editForm.hargaJual" :disabled="userRole !== 'admin'" type="number" class="w-full mt-1.5 bg-green-50/50 p-4 rounded-2xl font-bold text-sm text-green-600 outline-none disabled:opacity-70" />
          </div>

          <div>
            <label class="text-[10px] font-black text-orange-400 uppercase ml-1 tracking-widest">Jumlah Stok</label>
            <input v-model.number="editForm.stok" :disabled="userRole !== 'admin'" type="number" class="w-full mt-1.5 bg-orange-50 p-4 rounded-2xl font-black text-xl text-orange-600 outline-none disabled:opacity-70" />
          </div>
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Lokasi Rak</label>
            <input v-model="editForm.lokasi" :disabled="userRole !== 'admin'" type="text" class="w-full mt-1.5 bg-slate-50 p-4 rounded-2xl font-bold text-sm border-2 border-transparent focus:border-blue-500 outline-none disabled:opacity-70" />
          </div>

          <div class="md:col-span-2 pt-4">
            <button v-if="userRole === 'admin'" type="submit" class="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
              Simpan Perubahan
            </button>
            <button v-else @click="isModalOpen = false" type="button" class="w-full bg-slate-100 text-slate-600 py-5 rounded-[1.5rem] font-black uppercase tracking-widest active:scale-95 transition-all">
              Selesai Membaca
            </button>
          </div>
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
const editForm = ref({ nama: '', penerbit: '', stok: 0, hargaModal: 0, hargaJual: 0, lokasi: '', kategori: '', kode: '' })

const filteredItems = computed(() => {
  let items = store.items || []
  if (selectedCategory.value !== 'Semua') items = items.filter(i => i.kategori === selectedCategory.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(i => 
      i.nama?.toLowerCase().includes(q) || 
      i.penerbit?.toLowerCase().includes(q)
    )
  }
  return items
})

onMounted(() => store.fetchItems())

const openDetailModal = (item) => {
  currentId.value = item.id
  editForm.value = { ...item }
  isModalOpen.value = true
}

const updateBarang = async () => {
  if (userRole.value !== 'admin') return
  await store.updateItem(currentId.value, editForm.value)
  isModalOpen.value = false
}

const confirmDelete = (item) => {
  if (confirm(`Hapus ${item.nama}? Data yang dihapus tidak bisa dikembalikan.`)) store.deleteItem(item.id)
}
</script>