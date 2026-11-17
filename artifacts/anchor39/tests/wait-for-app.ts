import { request, type FullConfig } from '@playwright/test'

/** Wait for the managed website workflow without starting a duplicate server. */
export default async function waitForApp(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL!
  const client = await request.newContext({ baseURL })
  const deadline = Date.now() + 30000
  try {
    while (Date.now() < deadline) {
      try {
        const response = await client.get('/', { timeout: 2000 })
        if (response.ok() && (await response.text()).includes('<title>ANCHOR39')) return
      } catch {
        // The shared proxy or the managed website may still be starting.
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
    throw new Error(`ANCHOR39 is not ready at ${baseURL}. Start the managed workflow "artifacts/anchor39: web" and retry. Replit's shared proxy on port 80 routes "/" to the website service.`)
  } finally {
    await client.dispose()
  }
}
