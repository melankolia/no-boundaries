<script setup>
import SendIcon from 'vue-material-design-icons/Send.vue'
import { ref } from 'vue'

const message = ref(null)
const messages = ref([
  {
    message: 'Hi Cedar. Send me the mockup file.',
    sender: 'Sobor',
    time: '1 day ago'
  },
  {
    message: 'Hi Sobor, wait a minute',
    sender: 'user',
    time: '1 day ago'
  }
])

const handleSend = () => {
  messages.value = [
    ...messages.value,
    {
      message: message.value,
      sender: 'user',
      time: '1 day ago'
    }
  ]

  message.value = null
}
</script>

<template>
  <div class="flex flex-row h-svh">
    <div class="flex flex-1 flex-col">
      <div class="flex flex-row border-2 border-green-600 items-center p-2">
        <div class="flex flex-row w-10 h-10 border border-blue-500 bg-blue-500 rounded-full"></div>
        <p class="mx-2.5">Barnabas Sobor</p>
      </div>
      <div class="flex flex-col overflow-scroll mt-auto">
        <div
          v-for="(e, i) in messages"
          :key="`message-${i}`"
          class="flex flex-row m-2"
          :class="{ 'justify-end': e.sender == 'user' }"
        >
          <div
            class="flex flex-col w-10 h-10 bg-[#f4c425] border-[#f4c425] border-2 rounded-full"
          />
          <div class="flex flex-col mx-2.5 space-y-0.5">
            <div
              class="flex flex-col rounded-t-md rounded-br-md"
              :class="[e.sender != 'user' ? 'bg-blue-500' : 'bg-gray-300']"
            >
              <p
                class="text-md px-2 py-1.5"
                :class="[e.sender != 'user' ? 'text-white' : 'text-gray-800']"
              >
                {{ e.message }}
              </p>
            </div>
            <p class="text-xs pt-1">{{ e.time }}</p>
          </div>
        </div>
      </div>
      <div class="flex flex-row m-0.5">
        <input
          class="flex-1 rounded-md py-1 px-2 border border-gray-500"
          placeholder="Message"
          v-model="message"
          type="text"
          id="fname"
          name="fname"
          required
          @keyup.enter="handleSend"
        />
        <button
          class="flex flex-col items-center justify-center mx-2 rounded-full bg-blue-600 active:bg-blue-400 active:ring-1 active:ring-blue-600 min-w-9 min-h-9"
          @click="handleSend"
        >
          <SendIcon :size="18" class="-rotate-45 mb-1 ml-1 text-white" />
        </button>
      </div>
    </div>
  </div>
</template>
