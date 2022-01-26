import { Assert, Click } from 'cafe-puppeteer'
import puppeteer from 'puppeteer'
import { selectStampAndUpload } from '../library'

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
export async function testWebsiteUpload(page) {
    await chooseFile(page)
    await selectStampAndUpload(page)
    await assertDownloadPreview(page)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function chooseFile(page) {
    await Click.elementWithText(page, 'a', 'Files')
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        Click.elementWithText(page, 'button', 'Add Website')
    ])
    await fileChooser.accept(['test-data/test-website'])
    await assertUploadPreview(page)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertUploadPreview(page) {
    await Assert.elementWithTextExists(page, 'p', 'Folder Name: test-website')
    await Assert.elementWithTextExists(page, 'p', 'Kind: Website')
    await Assert.elementWithTextExists(page, 'p', 'Size: 390.10 kB')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertDownloadPreview(page) {
    await Assert.elementWithTextExists(page, 'p', 'Swarm Hash: ed73af53[…]02ca597e')
    await Assert.elementWithTextExists(page, 'p', 'Folder Name: test-website')
    await Assert.elementWithTextExists(page, 'p', 'Kind: Website')
    await Assert.elementWithTextExists(page, 'p', 'Size: 390.10 kB')
    await Assert.elementWithTextExists(page, 'h6', '3 items')
}
