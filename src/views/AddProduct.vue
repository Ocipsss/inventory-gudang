<template>
  <div class="max-w-md mx-auto pb-10 px-2">
    <div class="flex items-center gap-4 mb-8">
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
            <select v-model="form.kategori" required class="w-full mt-1.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none font-semibold transition-all">
              <option disabled value="">Pilih Kategori</option>
              <option v-for="cat in store.categories" :key="cat.id" :value="cat.name">
                {{ cat.name }}
              </option>
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
            <input v-model.number="form.hargaModal" type="number" min="0" class="w-full mt-1.5 bg-blue-50 p-4 rounded-2xl font-bold text-blue-600 outline-none" required />
          </div>
          <div class="relative">
            <label class="text-[10px] font-black text-green-500 uppercase ml-1">Harga Jual</label>
            <input v-model.number="form.hargaJual" type="number" min="0" class="w-full mt-1.5 bg-green-50 p-4 rounded-2xl font-bold text-green-600 outline-none" required />
          </div>
        </div>

        <div>
          <label class="text-[10px] font-black text-orange-400 uppercase ml-1">Stok Awal</label>
          <input v-model.number="form.stok" type="number" min="0" class="w-full mt-1.5 bg-orange-50 p-4 rounded-2xl font-black text-orange-600 outline-none" required />
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
  nama: '', 
  kode: '', 
  kategori: '', 
  lokasi: '', 
  hargaModal: 0, 
  hargaJual: 0, 
  stok: 0
})

// Fungsi generate kode unik agar tidak bertabrakan jika ada data dihapus
const generateAutoCode = () => {
  const prefix = 'MKH'
  const timestamp = Date.now().toString().slice(-4) // Ambil 4 digit terakhir timestamp
  const random = Math.floor(10 + Math.random() * 90) // 2 digit acak
  form.value.kode = `${prefix}-${timestamp}${random}`
}

onMounted(async () => {
  // Pastikan data terbaru ditarik
  await store.fetchItems()
  
  // Ambil .name karena store.categories sekarang adalah Array of Objects
  if (store.categories.length > 0) {
    // Cari kategori "Lainnya" atau default ke index 0
    const defaultCat = store.categories.find(c => c.name === 'Lainnya') || store.categories[0]
    form.value.kategori = defaultCat.name
  }
  
  generateAutoCode()
})

const handleSubmit = async () => {
  if (!form.value.kategori) {
    return alert('Harap pilih kategori produk!')
  }

  loading.value = true
  try {
    // Tambahkan data ke Firestore via Pinia Store
    await store.addItem({
      ...form.value,
      createdAt: new Date().toISOString() // Tambahan info waktu
    })
    
    alert('Barang berhasil disimpan!')
    router.push('/produk')
  } catch (e) { 
    console.error(e)
    alert('Gagal simpan barang. Pastikan koneksi internet stabil.') 
  } finally { 
    loading.value = false 
  }
}
</script>