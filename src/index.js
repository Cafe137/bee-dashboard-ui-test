import { Assert, Click, Wait } from 'cafe-puppeteer'
import { System } from 'cafe-utility'
import puppeteer from 'puppeteer'

const VIEWPORT = { width: 1366, height: 768 }

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertSuccessfulUpload(page) {
    await Assert.elementWithTextExists(page, 'button', 'Download')
    await Assert.elementWithTextExists(page, 'button', 'Update Feed')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertSingleFileAssetPreviewDuringUpload(page) {
    await Assert.elementWithTextExists(page, 'p', 'Filename: text.txt')
    await Assert.elementWithTextExists(page, 'p', 'Kind: text/plain')
    await Assert.elementWithTextExists(page, 'p', 'Size: 1.64 kB')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function asserFolderAssetPreviewDuringUpload(page) {
    await Assert.elementWithTextExists(page, 'p', 'Folder Name: test-folder')
    await Assert.elementWithTextExists(page, 'p', 'Kind: Folder')
    await Assert.elementWithTextExists(page, 'p', 'Size: 6.56 kB')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertWebsiteAssetPreviewDuringUpload(page) {
    await Assert.elementWithTextExists(page, 'p', 'Folder Name: test-website')
    await Assert.elementWithTextExists(page, 'p', 'Kind: Website')
    await Assert.elementWithTextExists(page, 'p', 'Size: 390.10 kB')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertSingleFileAssetPreviewDuringDownload(page) {
    await Assert.elementWithTextExists(page, 'p', 'Swarm Hash: da0773a9[…]5f7a1b54')
    await Assert.elementWithTextExists(page, 'p', 'Filename: text.txt')
    await Assert.elementWithTextExists(page, 'p', 'Kind: text/plain')
    await Assert.elementWithTextExists(page, 'p', 'Size: 1.64 kB')
}

async function assertFolderAssetPreviewDuringDownload(page) {
    await Assert.elementWithTextExists(page, 'p', 'Swarm Hash: 724ceacd[…]946b3897')
    await Assert.elementWithTextExists(page, 'p', 'Folder Name: test-folder')
    await Assert.elementWithTextExists(page, 'p', 'Kind: Folder')
    await Assert.elementWithTextExists(page, 'h6', '4 items')
}

async function assertWebsiteAssetPreviewDuringDownload(page) {
    await Assert.elementWithTextExists(page, 'p', 'Swarm Hash: ed73af53[…]02ca597e')
    await Assert.elementWithTextExists(page, 'p', 'Folder Name: test-website')
    await Assert.elementWithTextExists(page, 'p', 'Kind: Website')
    await Assert.elementWithTextExists(page, 'p', 'Size: 390.10 kB')
    await Assert.elementWithTextExists(page, 'h6', '3 items')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function uploadSingleFile(page) {
    await Click.elementWithText(page, 'a', 'Files')
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        Click.elementWithText(page, 'button', 'Add File')
    ])
    await fileChooser.accept(['test-data/text.txt'])
    await assertSingleFileAssetPreviewDuringUpload(page)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function uploadFolder(page) {
    await Click.elementWithText(page, 'a', 'Files')
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        Click.elementWithText(page, 'button', 'Add Folder')
    ])
    await fileChooser.accept(['test-data/test-folder'])
    await asserFolderAssetPreviewDuringUpload(page)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function uploadWebsite(page) {
    await Click.elementWithText(page, 'a', 'Files')
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        Click.elementWithText(page, 'button', 'Add Website')
    ])
    await fileChooser.accept(['test-data/test-website'])
    await assertWebsiteAssetPreviewDuringUpload(page)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function selectStampAndUpload(page) {
    await Click.elementWithText(page, 'button', 'Add Postage Stamp')
    await Click.elementWithClass(page, 'div', '.MuiSelect-select')
    await Click.elementWithClass(page, 'li', '.MuiListItem-button')
    await Wait.forEnabledStateXPath(page, 'button', 'Proceed With Selected Stamp')
    // seems necessary, even though button is enabled by the previous step, it is only highlighted and not clicked
    await System.sleepMillis(500)
    await Click.elementWithText(page, 'button', 'Proceed With Selected Stamp')
    await Click.elementWithText(page, 'button', 'Upload To Your Node')
    await assertSuccessfulUpload(page)
}

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [`--window-size=${VIEWPORT.width},${VIEWPORT.height}`]
    })
    const page = await browser.newPage()
    await page.goto('http://localhost:3001' || process.env.BEE_DASHBOARD_HOST, { waitUntil: 'networkidle0' })
    await uploadWebsite(page)
    await selectStampAndUpload(page)
    await assertWebsiteAssetPreviewDuringDownload(page)
    await uploadFolder(page)
    await selectStampAndUpload(page)
    await assertFolderAssetPreviewDuringDownload(page)
    await uploadSingleFile(page)
    await selectStampAndUpload(page)
    await assertSingleFileAssetPreviewDuringDownload(page)
}

try {
    await main()
} catch (error) {
    console.error(error)
}
