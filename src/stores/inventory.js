import { defineStore } from 'pinia'
import { db } from '../firebase/firebase'
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: [],
    // Sekarang akan berisi array of objects: [{id: '...', name: '...'}]
    categories: [], 
    loading: true,
    isInitialized: false 
  }),

  actions: {
    // 1. Ambil Barang & Kategori dengan proteksi duplikasi
    fetchItems() {
      if (this.isInitialized) return
      this.loading = true

      // Listener Produk
      onSnapshot(collection(db, 'products'), (snapshot) => {
        this.items = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }))
        this.loading = false
      })

      // Listener Kategori (Diperbaiki agar menyimpan ID)
      onSnapshot(collection(db, 'categories'), (snapshot) => {
        if (snapshot.empty) {
          // Tetap simpan sebagai objek agar konsisten
          this.categories = [
            { id: '1', name: 'Makanan' },
            { id: '2', name: 'Minuman' },
            { id: '3', name: 'Herbal' },
            { id: '4', name: 'Lainnya' }
          ]
        } else {
          // mapping dokumen ke object {id, name}
          this.categories = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name
          }))
        }
      })

      this.isInitialized = true
    },

    // 2. Tambah Kategori Baru
    async addCategory(catName) {
      // Cek duplikasi berdasarkan property 'name'
      const exists = this.categories.some(c => c.name.toLowerCase() === catName.toLowerCase())
      if (!exists && catName.trim() !== "") {
        await addDoc(collection(db, 'categories'), { name: catName })
      }
    },

    // 3. Hapus Kategori berdasarkan ID (Lebih Efisien & Akurat)
    // Sekarang kita tidak perlu query where() lagi karena sudah punya ID-nya
    async removeCategory(id) {
      try {
        await deleteDoc(doc(db, 'categories', id))
      } catch (error) {
        console.error("Gagal menghapus kategori:", error)
      }
    },

    // 4. Manajemen Produk
    async addItem(item) {
      await addDoc(collection(db, 'products'), item)
    },

    async updateItem(id, updatedData) {
      const itemRef = doc(db, 'products', id)
      // Pastikan ID tidak ikut terupdate masuk ke dalam data firestore
      const { id: _, ...data } = updatedData 
      await updateDoc(itemRef, data)
    },

    async deleteItem(id) {
      await deleteDoc(doc(db, 'products', id))
    }
  }
})