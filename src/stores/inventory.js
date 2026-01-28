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
      if (this.isInitialized || !auth.currentUser) return
      this.loading = true

      onSnapshot(collection(db, 'products'), (snapshot) => {
        this.items = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }))
        this.loading = false
      })

      onSnapshot(collection(db, 'categories'), (snapshot) => {
        if (snapshot.empty) {
          this.categories = [{ id: '1', name: 'Makanan' }, { id: '2', name: 'Minuman' }]
        } else {
          this.categories = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name
          }))
        }
      })
      this.isInitialized = true
    },

    // PROTEKSI: Cek role sebelum eksekusi ke Firebase
    async addCategory(catName) {
      if (localStorage.getItem('userRole') !== 'admin') return
      await addDoc(collection(db, 'categories'), { name: catName })
    },

    async removeCategory(id) {
      if (localStorage.getItem('userRole') !== 'admin') return
      await deleteDoc(doc(db, 'categories', id))
    },

    async addItem(item) {
      if (localStorage.getItem('userRole') !== 'admin') return
      await addDoc(collection(db, 'products'), item)
    },

    async updateItem(id, updatedData) {
      if (localStorage.getItem('userRole') !== 'admin') return
      const itemRef = doc(db, 'products', id)
      const { id: _, ...data } = updatedData 
      await updateDoc(itemRef, data)
    },

    async deleteItem(id) {
      if (localStorage.getItem('userRole') !== 'admin') return
      await deleteDoc(doc(db, 'products', id))
    }
  }
})