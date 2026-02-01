<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-0 md:p-6 lg:p-10">
    <div class="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white md:rounded-[4rem] shadow-2xl shadow-slate-200/50 overflow-hidden min-h-[600px]">
      
      <div class="hidden lg:flex bg-slate-900 relative p-16 flex-col justify-between overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div class="relative z-10">
          <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-8 rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 class="text-4xl font-black text-white leading-tight tracking-tighter uppercase">
            Kelola Stok <br/> <span class="text-blue-500">Lebih Efisien.</span>
          </h2>
          <p class="text-slate-400 mt-4 font-medium max-w-xs leading-relaxed">
            Sistem manajemen inventaris gudang Mekkah yang terintegrasi secara real-time dan aman.
          </p>
        </div>

        <div class="relative z-10">
          <div class="flex items-center gap-3">
            <div class="flex -space-x-3">
              <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                U{{ i }}
              </div>
            </div>
            <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Terpercaya oleh tim gudang</p>
          </div>
        </div>
      </div>

      <div class="p-10 md:p-16 lg:p-20 flex flex-col justify-center bg-white">
        <div class="lg:hidden flex flex-col items-center mb-10">
          <div class="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase">Mekkah Stock</h2>
        </div>

        <div class="mb-10 hidden lg:block">
          <h3 class="text-3xl font-black text-slate-800 tracking-tight">Selamat Datang</h3>
          <p class="text-slate-400 font-bold text-sm mt-1">Silakan masuk untuk mengakses dashboard</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Alamat Email</label>
            <input v-model="email" type="email" placeholder="email@toko.com" 
              class="w-full p-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold transition-all" required />
          </div>
          
          <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Kata Sandi</label>
            <input v-model="password" type="password" placeholder="••••••••" 
              class="w-full p-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold transition-all" required />
          </div>
          
          <button type="submit" :disabled="loading" 
            class="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-slate-200 active:scale-95 disabled:bg-slate-300 transition-all mt-6">
            {{ loading ? 'Memverifikasi...' : 'Masuk Sekarang' }}
          </button>
        </form>

        <p class="text-center mt-10 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          Version 1.0.2 • Secure Access
        </p>
      </div>
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