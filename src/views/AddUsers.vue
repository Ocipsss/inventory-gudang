<template>
  <div class="max-w-2xl mx-auto pb-20 px-4">
    
    <div class="mb-10">
      <h1 class="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Tambah Staff</h1>
      <p class="text-slate-500 text-sm font-medium mt-1">Daftarkan akses baru untuk anggota tim Anda</p>
    </div>

    <div class="bg-white p-8 lg:p-12 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -z-0 opacity-50"></div>
      
      <div class="relative z-10">
        <h2 class="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <span class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
          Registrasi Akun Staff
        </h2>

        <form @submit.prevent="handleRegisterStaff" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Email Akses</label>
              <input v-model="form.email" type="email" placeholder="contoh@gmail.com" 
                class="w-full mt-1.5 bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all" required />
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Password</label>
              <input v-model="form.password" type="password" placeholder="Minimal 6 karakter" 
                class="w-full mt-1.5 bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all" required />
            </div>
          </div>

          <div class="pt-6">
            <button type="submit" :disabled="loading" 
              class="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-slate-300 active:scale-95 disabled:bg-slate-300 transition-all">
              {{ loading ? 'Mendaftarkan...' : 'Daftarkan Staff Baru' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="mt-8 p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4 items-start">
      <div class="bg-amber-100 p-2 rounded-xl text-amber-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </div>
      <div>
        <p class="text-[10px] font-black uppercase text-amber-700 tracking-wider mb-1">Keamanan Sistem</p>
        <p class="text-xs font-medium text-amber-800 leading-relaxed">
          Setelah berhasil mendaftarkan staff, sesi Anda akan diselesaikan secara otomatis. Silakan login kembali untuk melanjutkan aktivitas sebagai Admin.
        </p>
      </div>
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
    const res = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password)
    
    await setDoc(doc(db, 'users', res.user.uid), {
      email: form.value.email,
      nama: form.value.email.split('@')[0],
      role: 'staff',
      createdAt: new Date().toISOString()
    })
    
    alert('Staff berhasil terdaftar! Sistem akan logout demi keamanan.')
    await signOut(auth)
    localStorage.clear() // Membersihkan role admin agar tidak bentrok
    router.push('/login')
  } catch (e) {
    alert('Gagal: ' + e.message)
  } finally {
    loading.value = false
  }
}
</script>