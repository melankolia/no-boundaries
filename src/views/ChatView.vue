<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/plugins/firebase'
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy } from 'firebase/firestore'

import SendIcon from 'vue-material-design-icons/Send.vue'

const message = ref(null)
const messages = ref([
  // {
  //   message: 'Hi Cedar. Send me the mockup file.',
  //   sender: 'Sobor',
  //   time: '1 day ago'
  // },
  // {
  //   message: 'Hi Sobor, wait a minute',
  //   sender: 'user',
  //   time: '1 day ago'
  // }
])

const handleSend = () => {
  addDoc(collection(db, 'chats'), {
    message: message.value,
    sender: 'user',
    time: serverTimestamp()
  })
    .then((docRef) => {
      if (docRef.id) {
        // messages.value = [
        //   ...messages.value,
        //   {
        //     message: message.value,
        //     sender: 'user',
        //     time: '1 day ago'
        //   }
        // ]
        getData('append')

        message.value = null
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

const getData = async (params = null) => {
  const chatRefs = collection(db, 'chats')

  getDocs(query(chatRefs, orderBy('time'))).then((result) => {
    if (params == 'append') messages.value = []

    result.forEach((doc) => {
      const timestamp = new Date(doc.data().time.seconds * 1000)
      const time = `${('0' + timestamp.getDate()).slice(-2)}-${('0' + (timestamp.getMonth() + 1)).slice(-2)}-${timestamp.getFullYear()}`
      messages.value = [
        ...messages.value,
        {
          ...doc.data(),
          time
        }
      ]
      console.log(`${doc.id} =>`, doc.data())
    })
  })
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="flex flex-row" style="height: 100dvh">
    <div class="flex flex-1 flex-col">
      <div class="flex flex-row border-2 items-center p-2">
        <div class="flex flex-row w-10 h-10 border border-blue-500 bg-blue-500 rounded-full"></div>
        <p class="mx-2.5">Barnabas Sobor</p>
      </div>
      <div class="flex flex-col flex-1 overflow-scroll p-4 space-y-5">
        <div
          v-for="(e, i) in messages"
          :key="`message-${i}`"
          class="flex"
          :class="[e.sender == 'user' ? 'flex-row-reverse' : 'flex-row']"
        >
          <div
            class="flex flex-col self-end w-10 h-10 mb-5 bg-[#f4c425] border-[#f4c425] border-2 rounded-full"
          />
          <div class="flex flex-col mx-2.5 space-y-0.5 max-w-[80%]" style="overflow-wrap: anywhere">
            <div
              class="flex flex-col rounded-t-md max-w-1/2"
              :class="[
                e.sender != 'user' ? 'bg-blue-500' : 'bg-gray-300',
                e.sender != 'user' ? 'rounded-br-md' : 'rounded-bl-md'
              ]"
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
      <div class="flex flex-row ml-3 my-3">
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
