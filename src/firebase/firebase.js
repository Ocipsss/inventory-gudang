import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Ganti dengan config asli dari Firebase Console kamu nanti
const firebaseConfig = {
  apiKey: "AIzaSyAFZv6UJemGR_udL8bfNR-eOCMBlgwY6EA",
  authDomain: "inventorytoko.firebaseapp.com",
  projectId: "inventorytoko",
  storageBucket: "inventorytoko.firebasestorage.app",
  messagingSenderId: "803165656899",
  appId: "1:803165656899:web:4e6c00c9d829aeaa8a41f6"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Aktifkan Fitur Offline (Hybrid)
// Ini memungkinkan aplikasi tetap jalan meski sinyal gudang hilang
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        // Biasanya karena buka banyak tab sekaligus
        console.warn('Persistence failed: Multiple tabs open');
    } else if (err.code == 'unimplemented') {
        // Browser jadul
        console.warn('Persistence not supported by browser');
    }
});

export { db, auth };