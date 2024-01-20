import { CHAT } from '@/router/constants'
const ChatView = () => import('./ChatView.vue')

const ChatRoute = {
  path: '/chat',
  name: CHAT,
  component: ChatView
}

export default ChatRoute
