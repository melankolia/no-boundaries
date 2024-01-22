<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  messages: {
    type: Object,
    required: true
  },
  recipient: {
    type: Object,
    required: true
  }
})

const { getUserId, getUserAva } = useUserStore()

const recipientAva = computed(() => props.recipient?.photoURL)
</script>

<template>
  <div
    v-for="(e, i) in messages"
    :key="`message-${i}`"
    class="flex"
    :class="[e.from == getUserId ? 'flex-row-reverse' : 'flex-row']"
  >
    <img
      :src="e.from != getUserId ? recipientAva : getUserAva"
      class="rounded-full max-w-8 max-h-8 object-cover self-end mb-2.5"
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
          class="text-md px-2.5 py-1.5"
          :class="[e.from != getUserId ? 'text-white' : 'text-gray-800']"
        >
          {{ e.message }}
        </p>
      </div>
      <p :class="{ 'self-end': e.from == getUserId }" class="text-xs pt-1">{{ e.time }}</p>
    </div>
  </div>
</template>
