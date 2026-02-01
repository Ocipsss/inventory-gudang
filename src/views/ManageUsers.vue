<template>
  <div class="max-w-7xl mx-auto pb-20 px-4">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 lg:mb-12">
      <div>
        <h1 class="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Manajemen Staff</h1>
        <p class="text-slate-500 text-sm font-medium mt-1">
          Terdapat <span class="text-blue-600 font-bold">{{ users.length }} akun</span> yang memiliki akses ke sistem
        </p>
      </div>
      
      <router-link to="/add-user" class="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition-all group">
        <span class="font-bold uppercase tracking-widest text-xs">Tambah Staff Baru</span>
        <div class="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </router-link>
    </div>

    <div v-if="users.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="user in users" :key="user.id" 
        class="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/30 flex flex-col items-center text-center relative overflow-hidden group hover:border-blue-100 transition-all duration-300">
        
        <div class="absolute top-4 right-4">
          <span :class="user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'" 
                class="text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
            {{ user.role }}
          </span>
        </div>

        <div class="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center font-black text-2xl text-slate-400 uppercase mb-4 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors duration-500">
          {{ user.nama?.charAt(0) }}
        </div>

        <div class="mb-6">
          <h3 class="font-black text-slate-800 uppercase text-base tracking-tight truncate max-w-[180px]">{{ user.nama }}</h3>
          <p class="text-[11px] text-slate-400 font-bold lowercase truncate max-w-[200px]">{{ user.email }}</p>
        </div>

        <div class="w-full pt-4 border-t border-slate-50 flex items-center justify-center gap-3">
          <div v-if="user.role === 'admin'" class="text-[10px] font-black text-slate-300 uppercase italic">
            Super User
          </div>
          <template v-else>
            <button @click="deleteUser(user)" class="flex items-center gap-2 text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition-colors py-2 px-4 rounded-xl hover:bg-red-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus Akses
            </button>
          </template>
        </div>

        <div class="absolute -bottom-2 -left-2 w-12 h-12 bg-blue-50 rounded-tr-3xl -z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>

    <div v-else class="bg-white border-2 border-dashed border-slate-100 p-20 rounded-[4rem] text-center max-w-2xl mx-auto">
      <div class="text-6xl mb-6">👥</div>
      <h3 class="text-slate-800 font-black uppercase text-xl">Belum ada staff</h3>
      <p class="text-slate-400 text-sm font-medium mt-2 leading-relaxed">
        Daftarkan anggota tim gudang Anda untuk mulai mengelola stok bersama-sama.
      </p>
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
      alert('Akses profil dicabut.')
    } catch (e) {
      alert('Gagal menghapus user.')
    }
  }
}
</script>