<template>
  <div class="max-w-4xl mx-auto pb-20 px-4">
    <div class="mb-10 lg:mb-12">
      <h1 class="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Tambah Barang</h1>
      <p class="text-slate-500 text-sm font-medium mt-1">Input stok baru ke database gudang pusat</p>
    </div>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-7 space-y-6">
        <div class="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50">
          <h2 class="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-6">Informasi Produk</h2>
          
          <div class="space-y-5">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Nama Barang</label>
              <input v-model="form.nama" type="text" placeholder="Masukkan nama produk..." class="w-full mt-1.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none transition-all font-semibold" required />
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Penerbit / Brand</label>
              <input v-model="form.penerbit" type="text" placeholder="Gema Insani, Al-Qosbah, atau Brand..." class="w-full mt-1.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none transition-all font-semibold" />
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
                  <option v-for="cat in store.categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Posisi / Rak</label>
              <input v-model="form.lokasi" type="text" placeholder="Contoh: Rak A-01" class="w-full mt-1.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none font-semibold" />
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50 h-full">
          <h2 class="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-6">Finansial & Stok</h2>
          
          <div class="space-y-5">
            <div>
              <label class="text-[10px] font-black text-blue-400 uppercase ml-1 tracking-widest">Harga Beli (Modal)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-blue-300">Rp</span>
                <input v-model.number="form.hargaModal" type="number" min="0" class="w-full mt-1.5 bg-blue-50/50 pl-11 p-4 rounded-2xl font-bold text-blue-600 outline-none border-2 border-transparent focus:border-blue-500 transition-all" required />
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black text-green-500 uppercase ml-1 tracking-widest">Harga Jual</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-green-300">Rp</span>
                <input v-model.number="form.hargaJual" type="number" min="0" class="w-full mt-1.5 bg-green-50/50 pl-11 p-4 rounded-2xl font-bold text-green-600 outline-none border-2 border-transparent focus:border-green-500 transition-all" required />
              </div>
            </div>

            <div class="pt-2">
              <label class="text-[10px] font-black text-orange-400 uppercase ml-1 tracking-widest">Jumlah Stok Masuk</label>
              <input v-model.number="form.stok" type="number" min="0" class="w-full mt-1.5 bg-orange-50 p-4 rounded-2xl font-black text-orange-600 outline-none border-2 border-transparent focus:border-orange-500 transition-all text-xl" required />
            </div>
          </div>

          <div class="mt-10">
            <button type="submit" :disabled="loading" class="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 active:scale-95 disabled:bg-slate-300 transition-all">
              {{ loading ? 'Memproses...' : 'Simpan Barang' }}
            </button>
          </div>
        </div>
      </div>
    </form>
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
  penerbit: '',
  kode: '', 
  kategori: '', 
  lokasi: '', 
  hargaModal: 0, 
  hargaJual: 0, 
  stok: 0
})

const generateAutoCode = () => {
  const prefix = 'MKH'
  const timestamp = Date.now().toString().slice(-4)
  const random = Math.floor(10 + Math.random() * 90)
  form.value.kode = `${prefix}-${timestamp}${random}`
}

onMounted(async () => {
  await store.fetchItems()
  if (store.categories.length > 0) {
    const defaultCat = store.categories.find(c => c.name === 'Lainnya') || store.categories[0]
    form.value.kategori = defaultCat.name
  }
  generateAutoCode()
})

const handleSubmit = async () => {
  if (!form.value.kategori) return alert('Harap pilih kategori produk!')
  loading.value = true
  try {
    await store.addItem({
      ...form.value,
      createdAt: new Date().toISOString()
    })
    alert('Barang berhasil disimpan!')
    router.push('/produk')
  } catch (e) { 
    alert('Gagal simpan barang.') 
  } finally { 
    loading.value = false 
  }
}
</script>