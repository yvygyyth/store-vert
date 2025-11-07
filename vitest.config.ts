import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import path from 'path'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    test: {
        browser: {
            provider: playwright(),
            enabled: true,
            // at least one instance is required
            instances: [{ browser: 'chromium' }]
        }
    }
})
