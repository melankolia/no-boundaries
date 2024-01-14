import { createRouter, createWebHistory } from 'vue-router'
const ChatView = () => import('../views/ChatView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'chatView' }
    },
    {
      path: '/chat',
      name: 'chatView',
      component: ChatView
    }
  ]
})

export default router
