<template>
  <div class="max-w-md mx-auto pb-20 px-4">
    <div class="flex items-center gap-4 mb-8">
      <router-link to="/" class="p-2 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-600 active:scale-90 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </router-link>
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight">Manajemen Staff</h1>
        <p class="text-slate-500 text-xs font-medium">Daftarkan akses untuk tim Anda</p>
      </div>
    </div>

    <div class="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50">
      <h2 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
        Tambah Staff Baru
      </h2>

      <form @submit.prevent="handleRegisterStaff" class="space-y-4">
        <div>
          <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Email Akses</label>
          <input v-model="form.email" type="email" placeholder="contoh@gmail.com" class="w-full mt-1.5 bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-blue-500 transition-all" required />
        </div>

        <div>
          <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Password</label>
          <input v-model="form.password" type="password" placeholder="Minimal 6 karakter" class="w-full mt-1.5 bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-blue-500 transition-all" required />
        </div>

        <div class="pt-4">
          <button type="submit" :disabled="loading" class="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl active:scale-95 disabled:bg-slate-300 transition-all">
            {{ loading ? 'Mendaftarkan...' : 'Daftarkan Staff' }}
          </button>
        </div>
      </form>
    </div>

    <div class="mt-8 p-5 bg-blue-50 rounded-3xl border border-blue-100 text-blue-700">
      <p class="text-[10px] font-bold uppercase mb-1">Penting</p>
      <p class="text-xs font-medium italic leading-relaxed">
        Setelah mendaftarkan staff baru, Anda akan otomatis ter-logout. Ini adalah prosedur keamanan standar Firebase untuk memverifikasi akun baru.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db } from '../firebase/firebase'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const form = ref({ email: '', password: '' })

const handleRegisterStaff = async () => {
  if (form.value.password.length < 6) return alert('Password minimal 6 karakter')
  
  loading.value = true
  try {
    // 1. Buat User di Auth
    const res = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password)
    
    // 2. Simpan role 'staff' ke Firestore
    await setDoc(doc(db, 'users', res.user.uid), {
      email: form.value.email,
      nama: form.value.email.split('@')[0],
      role: 'staff',
      createdAt: new Date().toISOString()
    })
    
    alert('Staff berhasil terdaftar! Anda akan diarahkan ke halaman login.')
    await signOut(auth)
    router.push('/login')
  } catch (e) {
    alert('Gagal: ' + e.message)
  } finally {
    loading.value = false
  }
}
</script>