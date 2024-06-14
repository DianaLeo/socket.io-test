import {
    addServerImportsDir,
    createResolver,
    defineNuxtModule,
} from "@nuxt/kit"
import defu from "defu"
import type { ModuleOptions } from "./types"

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: "redis",
        configKey: "redis",
        compatibility: {
            nuxt: "^3.11.x",
        },
    },
    defaults: {
        host: "localhost",
        port: 6379,
    },
    async setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)
        nuxt.options.runtimeConfig.redis = defu(
            nuxt.options.runtimeConfig.redis,
            options,
        )
        addServerImportsDir(resolver.resolve("./runtime/server/utils"))
    },
})
