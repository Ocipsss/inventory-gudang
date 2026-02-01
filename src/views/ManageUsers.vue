<template>
  <div class="max-w-md mx-auto pb-20 px-2">
    <div class="flex justify-between items-end mb-8 px-1">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight">Daftar Staff</h1>
        <p class="text-slate-500 text-xs font-medium">Total: {{ users.length }} akun terdaftar</p>
      </div>
      <router-link to="/add-user" class="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-200 active:scale-90 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </router-link>
    </div>

    <div class="space-y-3">
      <div v-for="user in users" :key="user.id" class="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 uppercase">
          {{ user.nama?.charAt(0) }}
        </div>
        <div class="flex-1">
          <h3 class="font-bold text-slate-800 uppercase text-sm">{{ user.nama }}</h3>
          <p class="text-[10px] text-slate-400 font-medium">{{ user.email }}</p>
        </div>
        <div class="flex flex-col items-end gap-1">
          <span :class="user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'" 
                class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
            {{ user.role }}
          </span>
          <button v-if="user.role !== 'admin'" @click="deleteUser(user)" class="text-red-300 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase/firebase'
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore'

const users = ref([])

onMounted(() => {
  onSnapshot(collection(db, 'users'), (snapshot) => {
    users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
})

const deleteUser = async (user) => {
  if (confirm(`Hapus akses untuk ${user.nama}?`)) {
    try {
      await deleteDoc(doc(db, 'users', user.id))
      alert('Data profil di Firestore dihapus. Catatan: User tetap ada di Auth (perlu dihapus manual via console).')
    } catch (e) {
      alert('Gagal menghapus user.')
    }
  }
}
</script>