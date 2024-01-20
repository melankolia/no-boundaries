import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { provider, auth } from '@/plugins/firebase'
import { useLocalStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
  const user = ref(
    useLocalStorage('user', {
      uid: null,
      displayName: null,
      email: null,
      photoUrl: null
    })
  )

  const getUserId = computed(() => user.value.uid)

  function login() {
    return new Promise((resolve, reject) => {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result)
          const token = credential.accessToken
          // The signed-in user info.
          const resultUser = result.user
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          user.value = {
            uid: resultUser.uid,
            displayName: resultUser.displayName,
            email: resultUser.email,
            photoUrl: resultUser.photoURL
          }

          console.log(resultUser.uid)
          resolve(token)
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          // The email of the user's account used.
          const email = error.customData.email
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error)

          const err = { errorCode, errorMessage, email, credential }
          console.log(err)
          reject(err)
          // ...
        })
    })
  }

  return { user, getUserId, login }
})
