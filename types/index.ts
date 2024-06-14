export type User = {
    userId: string
    socketId?: string
    username: string
    countryCode: string
    online?: boolean
    room?: string
    avatar: string
    lastActiveTime: number | undefined
}

export type Chat = {
    id: string
    room: string
    senderId: string
    text: string
    sentTime: string
}

export type ChatHistory = {
    history: Chat[]
    hasNext: boolean
    endCursor: number
}
