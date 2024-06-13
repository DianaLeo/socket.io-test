<script setup lang="ts">
import type {Socket} from "socket.io-client"
const {createClient} = useGroupChatSocketClient()
const socket = ref<Socket | null>(null)
const onConnect = ref(false)
onMounted(()=>{establishSocketConnection()})

const establishSocketConnection = async () => {
  socket.value = createClient()
  console.log("socket=",socket)
  socket.value?.on('connect', () => {
    onConnect.value = true
    console.log('[chat.vue]: ws connected')
  })
  socket.value?.emit('userJoin', "Diana", "EN")
}
</script>

<template>
  <div>
    {{onConnect}}
  </div>
</template>

<style scoped>

</style>