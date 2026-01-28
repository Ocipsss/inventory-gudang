import { defineStore } from 'pinia'
import { db, auth } from '../firebase/firebase'
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: [],
    categories: [], 
    loading: true,
    isInitialized: false 
  }),

  actions: {
    fetchItems() {
      // Hanya jalankan jika user sudah login dan belum diinisialisasi
      if (this.isInitialized || !auth.currentUser) return
      
      this.loading = true

      // Listener Produk
      onSnapshot(collection(db, 'products'), (snapshot) => {
        this.items = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }))
        this.loading = false
      }, (error) => {
        console.error("Firestore Products Error:", error)
      })

      // Listener Kategori
      onSnapshot(collection(db, 'categories'), (snapshot) => {
        if (snapshot.empty) {
          this.categories = [
            { id: '1', name: 'Makanan' },
            { id: '2', name: 'Minuman' },
            { id: '3', name: 'Herbal' },
            { id: '4', name: 'Lainnya' }
          ]
        } else {
          this.categories = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name
          }))
        }
      })

      this.isInitialized = true
    },

    async addCategory(catName) {
      const exists = this.categories.some(c => c.name.toLowerCase() === catName.toLowerCase())
      if (!exists && catName.trim() !== "") {
        await addDoc(collection(db, 'categories'), { name: catName })
      }
    },

    async removeCategory(id) {
      try {
        await deleteDoc(doc(db, 'categories', id))
      } catch (error) {
        console.error("Gagal menghapus kategori:", error)
      }
    },

    async addItem(item) {
      await addDoc(collection(db, 'products'), item)
    },

    async updateItem(id, updatedData) {
      const itemRef = doc(db, 'products', id)
      const { id: _, ...data } = updatedData 
      await updateDoc(itemRef, data)
    },

    async deleteItem(id) {
      await deleteDoc(doc(db, 'products', id))
    }
  }
})