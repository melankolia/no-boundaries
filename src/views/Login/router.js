import { LOGIN } from '@/router/constants'
const LoginView = () => import('./LoginView.vue')

const LoginRoute = {
  path: '/login',
  name: LOGIN,
  component: LoginView
}

export default LoginRoute
