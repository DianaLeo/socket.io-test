export interface RedisConfig {
    host: string
    port: number
}

export interface ModuleOptions extends RedisConfig {}

declare module "@nuxt/schema" {
    interface RuntimeConfig {
        redis: RedisConfig
    }
}
