import consola from "consola"
import { createClient, type RedisClientType } from "redis"
import type { Chat, ChatHistory } from "~/types"
import type { RedisConfig } from "../../../types"

const CHAT_HISTORY_KEY = "chatHistory"
let client: RedisClientType | null = null
let isReady: boolean = false
const logger = consola.withTag("redis")

interface AsyncRedisResult {
    client: RedisClientType | null
    getChatHistoryByRoom: (
        room: string,
        endCursor?: number,
        size?: number,
    ) => Promise<ChatHistory>
    saveChatToHistory: (chat: Chat) => void
}

async function initRedis(redisConfig: RedisConfig): Promise<RedisClientType> {
    const redisClient = createClient({
        url: `redis://${redisConfig.host}:${redisConfig.port}`,
    })
    // logger.success("redisClient initialized = ", redisClient)
    redisClient.on("connect", () =>
        logger.success("Redis server TCP connection established"),
    )
    redisClient.on("reconnecting", () => logger.info("Redis reconnecting"))
    redisClient.on("error", (err) =>
        logger.error(
            "Redis client error. Make sure redis-server is running.",
            err,
        ),
    )
    redisClient.on("ready", () => {
        isReady = true
        logger.info("Redis client initialized")
    })
    await redisClient.connect()
    return redisClient as RedisClientType
}

async function getListSegmentByKey(
    key: string,
    cursor: number = 0,
    size: number = 15,
): Promise<ChatHistory> {
    if (!client || !isReady)
        return {
            history: [],
            endCursor: 0,
            hasNext: false,
        }
    const start = cursor
    const end = start + size
    try {
        const rawData = (await client.lRange(key, start, end - 1)) ?? []
        const hasNext = rawData.length >= size
        const endCursor = hasNext ? end : 0
        return {
            history: rawData.map((data) => JSON.parse(data)) as Chat[],
            endCursor,
            hasNext,
        }
    } catch (e) {
        console.error("Redis get history error.", e)
        return {
            history: [],
            endCursor: 0,
            hasNext: false,
        }
    }
}

async function pushToListByKey(key: string, value: string, toEnd: "L" | "R") {
    try {
        client &&
            isReady &&
            (toEnd === "L"
                ? await client.lPush(key, value)
                : await client.rPush(key, value))
    } catch (e) {
        console.error("Redis save new chat to history error.", e)
    }
}

function formatRoomKey(room: string) {
    return `${CHAT_HISTORY_KEY}-${room}`
}

async function useAsyncRedis(): Promise<AsyncRedisResult> {
    const runtimeConfig = useRuntimeConfig()
    client = client ?? (await initRedis(runtimeConfig.redis))

    const getChatHistoryByRoom = async (
        room: string,
        endCursor?: number,
        size?: number,
    ): Promise<ChatHistory> => {
        return await getListSegmentByKey(formatRoomKey(room), endCursor, size)
    }
    const saveChatToHistory = async (chat: Chat) => {
        await pushToListByKey(
            formatRoomKey(chat.room),
            JSON.stringify(chat),
            "L",
        )
    }
    return {
        client,
        getChatHistoryByRoom,
        saveChatToHistory,
    }
}

export default useAsyncRedis
