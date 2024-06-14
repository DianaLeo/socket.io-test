import { type User } from "~/types"

export const users: User[] = [
    {
        userId: "0",
        socketId: undefined,
        username: "Admin",
        countryCode: "Global",
        online: false,
        room: undefined,
        avatar: "#e74c3c",
        lastActiveTime: undefined,
    },
    {
        userId: "1",
        socketId: undefined,
        username: "Diana",
        countryCode: "EN",
        online: false,
        room: undefined,
        avatar: "#e74c3c",
        lastActiveTime: undefined,
    },
    {
        userId: "2",
        socketId: undefined,
        username: "Ryan",
        countryCode: "EN",
        online: false,
        room: undefined,
        avatar: "#8e44ad",
        lastActiveTime: undefined,
    },
    {
        userId: "3",
        socketId: undefined,
        username: "Ryo",
        countryCode: "JP",
        online: false,
        room: undefined,
        avatar: "#3498db",
        lastActiveTime: undefined,
    },
    {
        userId: "4",
        socketId: undefined,
        username: "Tianyi",
        online: false,
        countryCode: "ES",
        avatar: "#e67e22",
        lastActiveTime: undefined,
    },
    {
        userId: "5",
        socketId: undefined,
        username: "VJ",
        countryCode: "ES",
        online: false,
        room: undefined,
        avatar: "#2ecc71",
        lastActiveTime: undefined,
    },
]

export function userJoin(
    userId: string,
    room: string,
    socketId: string,
): User | undefined {
    const user = getUserByUserId(userId)
    if (user) {
        user.room = room
        user.socketId = socketId
        user.lastActiveTime = Date.now()
        return user
    }
    return undefined
}

export function getUserByUserId(userId: string): User | undefined {
    return users.find((user) => user.userId === userId)
}

export function getUserBySocketId(socketId: string): User | undefined {
    return users.find((user) => user.socketId === socketId)
}

export function userLeave(socketId: string) {
    const user = getUserBySocketId(socketId)
    if (user) {
        user.room = undefined
        user.socketId = undefined
        user.lastActiveTime = undefined
    }
}

export function getRoomUsers(room: string) {
    const roomUsers = users.filter((user) => user.room === room)
    console.log("roomUsers=",roomUsers)
    return roomUsers
}

export function getOnlineUsers() {
    return users.filter(
        (user) => user.room && user.socketId && user.lastActiveTime,
    )
}

export function updateUserLastActiveTime(socketId: string) {
    const user = getUserBySocketId(socketId)
    if (!user) return
    user.lastActiveTime = Date.now()
}
