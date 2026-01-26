import { createApp } from 'vue'
import { createPinia } from 'pinia' // Import Pinia juga sekalian
import App from './App.vue'
import router from './router' // Import router yang baru dibuat
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router) // Gunakan router

app.mount('#app')