<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { CHAT } from '@/router/constants'

const router = useRouter()
const { login: userLogin } = useUserStore()

const loading = ref(false)

const login = () => {
  loading.value = true

  userLogin()
    .then(() => router.replace({ name: CHAT }))
    .catch((err) => console.error(err))
    .finally(() => (loading.value = false))
}
</script>

<template>
  <div class="h-dvh flex flex-col items-center justify-evenly">
    <div class="flex flex-col items-center">
      <img class="animate-bounce" src="@/assets/images/app-logo.png" width="180" />
      <p class="mt-2 text-2xl font-light"><span class="font-bold">No</span> Boundaries</p>
    </div>
    <button @click="login" class="bg-[#4889f4] rounded-sm flex flex-row items-center">
      <div class="flex flex-col p-2 m-0.5 bg-white">
        <img src="@/assets/images/google-icon.svg" width="24" />
      </div>
      <div class="min-w-[164px]">
        <p class="text-white mb-0 px-4">{{ loading ? 'Loading ...' : 'Sign in with Google' }}</p>
      </div>
    </button>
  </div>
</template>
