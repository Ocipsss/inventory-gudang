<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Inventory Toko</h2>
        <p class="text-gray-500 mt-2">Silakan login untuk mengelola stok</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            v-model="email"
            type="email" 
            required 
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="admin@toko.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input 
            v-model="password"
            type="password" 
            required 
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Memproses...</span>
          <span v-else>Masuk</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db } from '../firebase/firebase' // Pastikan db diimpor
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore' // Tambah ini untuk baca role
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  try {
    // 1. Cek Autentikasi (Cek apakah email & password benar di Firebase Auth)
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // 2. Ambil data User dari Firestore berdasarkan UID
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      
      // Simpan role ke localStorage agar bisa digunakan di komponen lain (misal untuk sembunyikan tombol hapus)
      localStorage.setItem('userRole', userData.role)
      localStorage.setItem('userName', userData.nama)

      alert(`Selamat Datang, ${userData.nama}!`)

      // 3. Arahkan berdasarkan role
      if (userData.role === 'admin') {
        router.push('/') // Admin ke Dashboard penuh
      } else {
        router.push('/produk') // Staff langsung ke daftar produk saja
      }
    } else {
      // Kasus jika user ada di Auth tapi belum dibuatkan dokumennya di Firestore
      alert('Login berhasil, tapi data profil tidak ditemukan. Hubungi Admin Utama.')
    }
  } catch (error) {
    console.error(error)
    // Pesan error yang lebih user-friendly
    let message = 'Gagal Login: Periksa kembali email dan password Anda.'
    if (error.code === 'auth/user-not-found') message = 'Akun tidak terdaftar di Firebase B.'
    if (error.code === 'auth/wrong-password') message = 'Password salah.'
    
    alert(message)
  } finally {
    loading.value = false
  }
}
</script>