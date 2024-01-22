<script setup>
import { ref, onMounted } from 'vue'
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
import SendIcon from 'vue-material-design-icons/Send.vue'
import Loading from '@/components/GeneralLoader.vue'
import BubbleChat from '@/components/BubbleChat.vue'

import { useUserStore } from '@/stores/user'

const { getUserId } = useUserStore()

const chatsElement = ref(null)
const loading = ref(true)

const recipient = ref({
  secureId: null,
  username: null,
  photoURL: null,
  email: null
})

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
    to: recipient.value.secureId,
    message: message.value,
    secureId: messages.value.at(-1).secureId,
    time: serverTimestamp()
  }
  addDoc(collection(db, 'conversations'), {
    ...payload
  })
    .then((docRef) => {
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
  try {
    const [convo] = await getChatRooms()
    if (convo.exists()) {
      await getRecipients(convo.get('participants'))
      await getConversations(convo.get('conversationId'))
    }
  } finally {
    loading.value = false
  }
}

const getRecipients = async (participants) => {
  return new Promise((resolve) => {
    const participant = participants[1]

    const recipRef = doc(db, 'users', participant)
    getDoc(recipRef)
      .then((doc) => {
        if (doc.exists()) {
          recipient.value = {
            ...recipient.value,
            ...doc.data(),
            secureId: participant
          }
          resolve(doc.data())
        }
      })
      .catch((err) => console.error(err))
  })
}
const getChatRooms = async () => {
  return new Promise((resolve) => {
    const convoRef = collection(db, 'chat_rooms')
    getDocs(query(convoRef, where('participants', 'array-contains', getUserId)))
      .then((docs) => {
        if (!docs.empty) {
          resolve(docs.docs)
        }
      })
      .catch((err) => console.error(err))
  })
}

const getConversations = async (convoId) => {
  const convoRef = collection(db, 'conversations')
  getDocs(query(convoRef, where('secureId', '==', convoId), orderBy('time')))
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
}

const handleFocus = () => {
  console.log('HANDLE FOCUS')
}

onMounted(() => {
  getData()
  setTimeout(() => {
    chatsElement.value.scrollTop += 250
  }, 5000)
})
</script>

<template>
  <div class="flex flex-row h-dvh">
    <div class="flex flex-1 flex-col">
      <div class="flex flex-row border-2 items-center p-2">
        <img :src="recipient.photoURL" class="rounded-full max-w-10 max-h-10 object-cover" />
        <!-- <div class="flex flex-row w-10 h-10 border border-blue-500 bg-blue-500 rounded-full"></div> -->
        <p class="mx-2.5">{{ recipient.username }}</p>
      </div>
      <div ref="chatsElement" class="flex flex-col flex-1 overflow-scroll p-4 space-y-5">
        <Loading v-if="loading" />
        <BubbleChat v-else :messages="messages" :recipient="recipient" />
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
