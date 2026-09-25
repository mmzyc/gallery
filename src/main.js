import { createApp } from 'vue'
import App from './App.vue'

import './styles/themes/dark.css'
import './styles/themes/light.css'
import.meta.glob(['./styles/**/*.css', '!./styles/themes/**'], { eager: true })

createApp(App).mount('#app')