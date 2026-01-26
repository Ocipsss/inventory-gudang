<template>
  <div class="max-w-md mx-auto pb-10 px-2">
    <div class="flex items-center gap-4 mb-8">
      <router-link to="/produk" class="p-2 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-600 active:scale-90 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </router-link>
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight">Tambah Barang</h1>
        <p class="text-slate-500 text-xs italic font-medium">Input stok baru ke gudang</p>
      </div>
    </div>

    <div class="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Informasi Produk</label>
          <input v-model="form.nama" type="text" placeholder="Nama Barang" class="w-full mt-1.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none transition-all font-semibold" required />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Kode SKU</label>
            <input v-model="form.kode" type="text" readonly class="w-full mt-1.5 bg-slate-100 border-2 border-transparent p-4 rounded-2xl font-mono text-sm text-slate-500 cursor-not-allowed uppercase" />
          </div>
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Kategori</label>
            <select v-model="form.kategori" class="w-full mt-1.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none font-semibold transition-all">
              <option v-for="cat in store.categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Posisi di Gudang</label>
          <input v-model="form.lokasi" type="text" placeholder="Rak A-01" class="w-full mt-1.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none font-semibold" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="relative">
            <label class="text-[10px] font-black text-blue-400 uppercase ml-1">Harga Beli</label>
            <input v-model.number="form.hargaModal" type="number" class="w-full mt-1.5 bg-blue-50 p-4 rounded-2xl font-bold text-blue-600 outline-none" />
          </div>
          <div class="relative">
            <label class="text-[10px] font-black text-green-500 uppercase ml-1">Harga Jual</label>
            <input v-model.number="form.hargaJual" type="number" class="w-full mt-1.5 bg-green-50 p-4 rounded-2xl font-bold text-green-600 outline-none" />
          </div>
        </div>

        <div>
          <label class="text-[10px] font-black text-orange-400 uppercase ml-1">Stok Awal</label>
          <input v-model.number="form.stok" type="number" class="w-full mt-1.5 bg-orange-50 p-4 rounded-2xl font-black text-orange-600 outline-none" />
        </div>

        <div class="pt-6">
          <button type="submit" :disabled="loading" class="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl active:scale-95 disabled:bg-slate-300 transition-all">
            {{ loading ? 'Menyimpan...' : 'Simpan Barang' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInventoryStore } from '../stores/inventory'
import { useRouter } from 'vue-router'

const store = useInventoryStore()
const router = useRouter()
const loading = ref(false)

const form = ref({
  nama: '', kode: '', kategori: '', lokasi: '', hargaModal: 0, hargaJual: 0, stok: 0
})

const generateAutoCode = () => {
  const prefix = 'MKH'
  const total = (store.items?.length || 0) + 1
  form.value.kode = `${prefix}-${String(total).padStart(4, '0')}`
}

onMounted(async () => {
  // Ambil data (termasuk kategori & items untuk kode auto)
  await store.fetchItems()
  
  // Set default kategori jika ada
  if (store.categories.length > 0) {
    form.value.kategori = store.categories[0]
  }
  generateAutoCode()
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await store.addItem(form.value)
    router.push('/produk')
  } catch (e) { alert('Gagal simpan') }
  finally { loading.value = false }
}
</script>