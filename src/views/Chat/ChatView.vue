<script setup>
import { ref, reactive, onMounted } from 'vue'
import { db } from '@/plugins/firebase'
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  getDocs,
  getDoc,
  doc
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'

const { getUserId } = useUserStore()

import SendIcon from 'vue-material-design-icons/Send.vue'
import Loading from '@/components/GeneralLoader.vue'

const chatsElement = ref(null)
const loading = ref(true)
// const userId = ref('hv37K6HtotLezogo4iod')
// const userId = ref('xbTjR9JwUJ5KqmOBPSv3')

const conversationId = ref('dcd92b40-bced-4831-b4f7-bf1007211b15')

const recipient = reactive({
  secureId: 'xbTjR9JwUJ5KqmOBPSv3',
  username: 'Sara Putri Fauliah'
})
// const recipient = reactive({
//   secureId: 'hv37K6HtotLezogo4iod',
//   username: 'Ageng Setyo Nugroho'
// })

const message = ref(null)
const messages = ref([
  {
    from: null,
    to: null,
    message: null,
    secureId: null,
    time: null
  }
])

const handleSend = () => {
  const payload = {
    from: getUserId,
    to: recipient.secureId,
    message: message.value,
    secureId: messages.value.at(-1).secureId,
    time: serverTimestamp()
  }
  addDoc(collection(db, 'conversations'), {
    ...payload
  })
    .then((docRef) => {
      // console.log(docRef.)
      if (docRef.id) {
        const convoRef = doc(db, 'conversations', docRef.id)
        getDoc(convoRef)
          .then((doc) => {
            const timestamp = new Date(doc.data().time.seconds * 1000)
            const time = `${('0' + timestamp.getHours()).slice(-2)}:${('0' + timestamp.getMinutes()).slice(-2)}`

            messages.value = [...messages.value, { ...doc.data(), time }]
          })
          .catch((err) => {
            console.error(err)
            const timestamp = new Date()
            const time = `${('0' + timestamp.getHours()).slice(-2)}:${('0' + timestamp.getMinutes()).slice(-2)}`
            messages.value = [...messages.value, { ...payload, time }]
          })
          .finally(() => {
            message.value = null
            chatsElement.value.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest'
            })
          })
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

// const getSingleData = async () => {
//   setTimeout(() => {
//     loading.value = false
//   }, 5000)
//   const userRef = doc(db, 'users', userId.value)

//   getDoc(userRef).then((docSnap) => {
//     if (docSnap.exists()) {
//       console.log('Document Data:', docSnap.data())
//     }
//   })
// }

const getData = async () => {
  const convoRef = collection(db, 'conversations')

  getDocs(query(convoRef, where('secureId', '==', conversationId.value), orderBy('time')))
    .then((docs) => {
      if (docs.size > 0) {
        let result = []

        docs.forEach((doc) => {
          const timestamp = new Date(doc.data().time.seconds * 1000)
          const time = `${('0' + timestamp.getHours()).slice(-2)}:${('0' + timestamp.getMinutes()).slice(-2)}`

          result = [
            ...result,
            {
              ...doc.data(),
              time
            }
          ]
        })

        messages.value = [...result]
      }
    })
    .catch((err) => console.error(err))
    .finally(() => {
      loading.value = false
    })
}

const handleFocus = () => {
  console.log('HANDLE FOCUS')
}

onMounted(() => {
  getData()
  setTimeout(() => {
    chatsElement.value.scrollTop += 250
  }, 10000)
})
</script>

<template>
  <div class="flex flex-row h-dvh">
    <div class="flex flex-1 flex-col">
      <div class="flex flex-row border-2 items-center p-2">
        <div class="flex flex-row w-10 h-10 border border-blue-500 bg-blue-500 rounded-full"></div>
        <p class="mx-2.5">{{ recipient.username }}</p>
      </div>
      <div ref="chatsElement" class="flex flex-col flex-1 overflow-scroll p-4 space-y-5">
        <Loading v-if="loading" />
        <div
          v-else
          v-for="(e, i) in messages"
          :key="`message-${i}`"
          class="flex"
          :class="[e.from == getUserId ? 'flex-row-reverse' : 'flex-row']"
        >
          <div
            class="flex flex-col self-end w-10 h-10 mb-5 bg-[#f4c425] border-[#f4c425] border-2 rounded-full"
          />
          <div class="flex flex-col mx-2.5 space-y-0.5 max-w-[80%]" style="overflow-wrap: anywhere">
            <div
              class="flex flex-col rounded-t-md max-w-1/2"
              :class="[
                e.from != getUserId ? 'bg-blue-500' : 'bg-gray-300',
                e.from != getUserId ? 'rounded-br-md' : 'rounded-bl-md'
              ]"
            >
              <p
                class="text-md px-2 py-1.5"
                :class="[e.from != getUserId ? 'text-white' : 'text-gray-800']"
              >
                {{ e.message }}
              </p>
            </div>
            <p :class="{ 'self-end': e.from == getUserId }" class="text-xs pt-1">{{ e.time }}</p>
          </div>
        </div>
      </div>
      <div class="flex flex-row ml-3 my-3">
        <input
          @focus="handleFocus"
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
