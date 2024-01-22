import { CHAT } from '@/router/constants'
const ChatView = () => import('./ChatView.vue')

const ChatRoute = {
  path: '/chat',
  name: CHAT,
  component: ChatView,
  meta: {
    requiresAuth: true
  }
}

export default ChatRoute
