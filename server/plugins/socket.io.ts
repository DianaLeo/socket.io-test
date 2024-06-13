import type { NitroApp } from "nitropack"
import { Server as Engine } from "engine.io"
import { Server } from "socket.io"
import { defineEventHandler } from "h3"
import { defineNitroPlugin } from "nitropack/dist/runtime/plugin"

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