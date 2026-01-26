import { defineStore } from 'pinia'
import { db } from '../firebase/firebase'
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: [],
    categories: [], // Sekarang kosong, akan diisi dari Firebase
    loading: true
  }),
  actions: {
    // 1. Ambil Barang & Kategori secara Real-time
    fetchItems() {
      // Ambil Produk
      const qProducts = collection(db, 'products')
      onSnapshot(qProducts, (snapshot) => {
        this.items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        this.loading = false
      })

      // Ambil Kategori (Sama seperti produk)
      const qCats = collection(db, 'categories')
      onSnapshot(qCats, (snapshot) => {
        // Jika Firebase kosong, beri default agar aplikasi tidak error
        if (snapshot.empty) {
          this.categories = ['Makanan', 'Minuman', 'Herbal', 'Lainnya']
        } else {
          this.categories = snapshot.docs.map(doc => doc.data().name)
        }
      })
    },

    // 2. Tambah Kategori Baru ke Firebase
    async addCategory(catName) {
      if (!this.categories.includes(catName)) {
        await addDoc(collection(db, 'categories'), { name: catName })
      }
    },

    // 3. Hapus Kategori dari Firebase
    async removeCategory(catName) {
      // Kita cari dulu ID dokumen berdasarkan namanya
      const qCats = collection(db, 'categories')
      // Catatan: Untuk hapus yang lebih akurat, idealnya kategori punya ID unik
      // Tapi untuk saat ini, kita bisa filter sederhana atau hapus manual di Firebase Console
      alert("Hapus kategori disarankan melalui Firebase Console atau gunakan ID unik.")
    },

    async updateItem(id, updatedData) {
      const itemRef = doc(db, 'products', id)
      await updateDoc(itemRef, updatedData)
    },

    async addItem(item) {
      await addDoc(collection(db, 'products'), item)
    },

    async deleteItem(id) {
      await deleteDoc(doc(db, 'products', id))
    }
  }
})