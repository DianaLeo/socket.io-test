<script setup lang="ts">
import type { User } from "~/types"
import type {Socket} from "socket.io-client"

const {createClient} = useGroupChatSocketClient()

const socket = ref<Socket | null>(null)
const onConnect = ref(false)
const currentRoom = ref<string>("EN")
const usersInRoom = ref<User[]>([])

onMounted(()=>{establishSocketConnection()})

const establishSocketConnection = async () => {
  socket.value = createClient()

  socket.value?.on('connect', () => {
    onConnect.value = true
    console.log('[chat.vue]: ws connected')
  })
  socket.value?.emit('userJoin', "1", "EN")
  socket.value?.on(
      "roomUsers",
      (payload: { room: string; users: User[] }) => {
        if (currentRoom.value === payload.room)
          usersInRoom.value = payload.users
      },
  )
}
</script>

<template>
  <div class="flex flex-col">
    <p>{{onConnect}}</p>
    <p>{{currentRoom}}</p>
    <p>{{usersInRoom}}</p>
  </div>
</template>

<style scoped>

</style>