import { createRouter, createWebHistory } from 'vue-router'
import ChatRoute from '@/views/Chat/router'
import LoginRoute from '@/views/Login/router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'chatView' }
    },
    LoginRoute,
    ChatRoute
  ]
})

export default router
