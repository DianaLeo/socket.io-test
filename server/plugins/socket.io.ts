import type { NitroApp } from "nitropack"
import { Server as Engine } from "engine.io"
import { Server, type Socket } from "socket.io"
import { defineEventHandler } from "h3"
import { defineNitroPlugin } from "nitropack/dist/runtime/plugin"
import type { Chat } from "~/types"
import {
    getRoomUsers,
    userJoin,
} from "../utils/users"

export default defineNitroPlugin((nitroApp: NitroApp) => {
    const engine = new Engine()
    const io = new Server({connectionStateRecovery:{maxDisconnectionDuration:1000}})
    io.bind(engine)

    io.on("connection", (socket) => {
        console.info(
            "[Server/Plugin]: Group chat web socket connected, socket.id=",
            socket.id,
        )

        // USER JOIN
        socket.on("userJoin", async (userId: string, room: string) => {
            console.log("[Server/Plugin]: userJoin", userId, room)
            await userJoinRoom(io, socket, userId, room)
        })
    })

    nitroApp.router.use(
        "/socket.io/",
        defineEventHandler({
            handler(event) {
                engine.handleRequest(event.node.req, event.node.res)
                event._handled = true
            },
        }),
    )
})

async function userJoinRoom(
    io: Server,
    socket: Socket,
    userId: string,
    room: string,
) {
    const { getChatHistoryByRoom } = await useAsyncRedis()
    const user = userJoin(userId, room, socket.id)
    console.log("userJoinRoom user=",user)
    if (user) {
        socket.join(room)
        socket.broadcast
            .to(room)
            .emit(
                "message",
                formatMessage(
                    "0",
                    `${user.username} has Joined the chat`,
                    room,
                ),
            )
        io.to(room).emit("roomUsers", {
            room,
            users: getRoomUsers(room),
        })
        const parsedHistory = await getChatHistoryByRoom(room, 0)
        socket.emit("history", parsedHistory)
    }
}

function formatMessage(senderId: string, text: string, room: string): Chat {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = String(now.getFullYear()).slice(-2)
    let hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'pm' : 'am'

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12
    // Combine the date and time parts into the final string
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`

    return {
        id: "0",
        room,
        senderId: senderId,
        text,
        sentTime: formattedDateTime,
    }
}