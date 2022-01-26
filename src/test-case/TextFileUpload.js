import { Assert, Click } from 'cafe-puppeteer'
import puppeteer from 'puppeteer'
import { selectStampAndUpload } from '../library'

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
export async function testTextFileUpload(page) {
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
        Click.elementWithText(page, 'button', 'Add File')
    ])
    await fileChooser.accept(['test-data/text.txt'])
    await assertUploadPreview(page)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertUploadPreview(page) {
    await Assert.elementWithTextExists(page, 'p', 'Filename: text.txt')
    await Assert.elementWithTextExists(page, 'p', 'Kind: text/plain')
    await Assert.elementWithTextExists(page, 'p', 'Size: 1.64 kB')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertDownloadPreview(page) {
    await Assert.elementWithTextExists(page, 'p', 'Swarm Hash: da0773a9[…]5f7a1b54')
    await Assert.elementWithTextExists(page, 'p', 'Filename: text.txt')
    await Assert.elementWithTextExists(page, 'p', 'Kind: text/plain')
    await Assert.elementWithTextExists(page, 'p', 'Size: 1.64 kB')
}
