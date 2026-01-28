<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100">
      <div class="text-center mb-10">
        <div class="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-200 rotate-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
        </div>
        <h2 class="text-3xl font-black text-slate-800 tracking-tighter uppercase">Mekkah Stock</h2>
        <p class="text-slate-400 font-bold text-sm mt-1">Inventory Management System</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <input v-model="email" type="email" placeholder="Email" class="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-bold transition-all" required />
        <input v-model="password" type="password" placeholder="Password" class="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-bold transition-all" required />
        
        <button type="submit" :disabled="loading" class="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 disabled:bg-slate-300 transition-all mt-4">
          {{ loading ? 'Memverifikasi...' : 'Masuk Sekarang' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db } from '../firebase/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await signInWithEmailAndPassword(auth, email.value, password.value)
    const userDoc = await getDoc(doc(db, 'users', res.user.uid))

    if (userDoc.exists()) {
      const data = userDoc.data()
      localStorage.setItem('userRole', data.role)
      localStorage.setItem('userName', data.nama)
      
      data.role === 'admin' ? router.push('/') : router.push('/produk')
    } else {
      alert('Profil belum dibuat di Firestore. Hubungi Admin.')
    }
  } catch (e) {
    alert('Email atau Password salah!')
  } finally {
    loading.value = false
  }
}
</script>