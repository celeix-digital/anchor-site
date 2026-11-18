import { expect, test } from '@playwright/test'

test('all original routes, assets, fonts, redirects and fallback remain available', async ({ page }) => {
  test.setTimeout(60000)
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const path of ['/', '/shipping-agents', '/terminal-agents', '/services', '/about', '/how-it-works', '/book-demo', '/thank-you']) {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page.locator('main h1')).toBeVisible()
    await expect(page).not.toHaveTitle(/Replit Agent/)
    // Load even the offscreen lazy screenshots, not just the viewport's images.
    await page.locator('img').evaluateAll((images) => images.forEach((image) => { image.loading = 'eager' }))
    await page.waitForFunction(() => [...document.images].every((image) => image.complete))
    expect(await page.locator('img').evaluateAll((images) => images.filter((image) => image.naturalWidth === 0).map((image) => image.src))).toEqual([])
  }
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check('800 24px "Big Shoulders Display"'))).toBe(true)
  expect(await page.evaluate(() => document.fonts.check('400 16px "Hanken Grotesk"'))).toBe(true)
  await page.goto('/vision?source=old#main')
  await expect(page).toHaveURL(/\/about\?source=old#main$/)
  await page.goto('/missing-page')
  await expect(page.getByRole('heading', { name: 'Off the chart.' })).toBeVisible()
  expect(errors).toEqual([])
})

test('demo requests preserve validation, interest selection and email handoff', async ({ page }) => {
  await page.goto('/thank-you')
  await expect(page.getByRole('heading', { name: 'Nothing to confirm yet.' })).toBeVisible()
  await page.goto('/')
  await page.locator('.nav-cta').click()
  await expect(page).toHaveURL(/\/book-demo$/)
  await page.getByRole('button', { name: 'Continue in email' }).click()
  await expect(page.locator('.field-err')).toHaveCount(6)
  await expect(page.locator('#f-name')).toBeFocused()
  await page.goto('/book-demo?interest=terminal')
  await expect(page.locator('input[value="terminal"]')).toBeChecked()
  await expect(page.getByText('Terminal coordination is in design, not live.', { exact: false })).toBeVisible()
  for (const [field, value] of Object.entries({ name: 'Migration Test', email: 'migration@example.com', company: 'Test Shipping', port: 'Test Port', role: 'Shipping agent' })) {
    await page.locator(`#f-${field}`).fill(value)
  }
  await page.locator('#f-consent').check()
  // A mailto handoff does not send mail. Block it if Chromium attempts a request.
  await page.route('mailto:**', (route) => route.abort())
  await page.getByRole('button', { name: 'Continue in email' }).click()
  await expect(page).toHaveURL(/\/thank-you$/)
  await expect(page.getByRole('heading', { name: 'One step left: press send.' })).toBeVisible()
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('anchor-request')!).interest)).toBe('Terminals (in design)')
  await page.reload()
  await expect(page.getByRole('heading', { name: 'One step left: press send.' })).toBeVisible()
})

test('mobile menu navigates and closes without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const toggle = page.locator('.nav-toggle')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await page.locator('#nav-menu').getByRole('link', { name: 'Shipping agents', exact: true }).click()
  await expect(page).toHaveURL(/\/shipping-agents$/)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('shipping-agent feature screenshots have clear, responsive inner padding', async ({ page }) => {
  await page.goto('/shipping-agents')
  const screenshots = page.locator('.feature-screen')
  await expect(screenshots).toHaveCount(4)
  await screenshots.first().scrollIntoViewIfNeeded()
  await expect(screenshots.first().locator('img')).toBeVisible()
  const desktopPadding = await screenshots.first().evaluate((element) => getComputedStyle(element).paddingTop)
  expect(Number.parseFloat(desktopPadding)).toBeGreaterThanOrEqual(12)
  for (const image of await screenshots.locator('img').all()) {
    await expect(image).toHaveAttribute('src')
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  const mobilePadding = await page.locator('.feature-screen').first().evaluate((element) => getComputedStyle(element).paddingTop)
  expect(Number.parseFloat(mobilePadding)).toBeGreaterThanOrEqual(12)
})
