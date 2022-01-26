import puppeteer from 'puppeteer'
import { testFolderUpload } from './test-case/FolderUpload'
import { testTextFileUpload } from './test-case/TextFileUpload'
import { testWebsiteUpload } from './test-case/WebsiteUpload'

const VIEWPORT = { width: 1366, height: 768 }

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [`--window-size=${VIEWPORT.width},${VIEWPORT.height}`]
    })
    const page = await browser.newPage()
    await page.goto('http://localhost:3001' || process.env.BEE_DASHBOARD_HOST, { waitUntil: 'networkidle0' })
    await testWebsiteUpload(page)
    await testFolderUpload(page)
    await testTextFileUpload(page)
}

try {
    await main()
} catch (error) {
    console.error(error)
}
