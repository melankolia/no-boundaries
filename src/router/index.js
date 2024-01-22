import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { CHAT, LOGIN } from './constants'

import ChatRoute from '@/views/Chat/router'
import LoginRoute from '@/views/Login/router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: CHAT }
    },
    LoginRoute,
    ChatRoute
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const { getUserId } = useUserStore()
    if (!getUserId) next({ name: LOGIN })

    next()
  } else {
    next()
  }
})

export default router
