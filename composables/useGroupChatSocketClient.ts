import { io, type Socket } from "socket.io-client"
import type {Ref} from "vue";

const client = ref<Socket | null>(null)

interface useSocketClientResult{
    createClient:()=>Socket|null
    cleanUpClient:()=>void
}
export function useGroupChatSocketClient(opt?: { path: string }): useSocketClientResult {
    function createClient(): Socket|null {
        if (client.value) {
            return client.value as Socket
        }
        client.value = opt ? io(opt.path) : io()
        return client.value as Socket
    }

    function cleanUpClient() {
        if (client.value) {
            client.value.disconnect()
            client.value = null
        }
    }
    return {
        createClient,
        cleanUpClient
    }
}
