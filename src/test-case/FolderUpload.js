import { Assert, Click } from 'cafe-puppeteer'
import puppeteer from 'puppeteer'
import { selectStampAndUpload } from '../library'

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
export async function testFolderUpload(page) {
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
        Click.elementWithText(page, 'button', 'Add Folder')
    ])
    await fileChooser.accept(['test-data/test-folder'])
    await assertUploadPreview(page)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertDownloadPreview(page) {
    await Assert.elementWithTextExists(page, 'p', 'Swarm Hash: 724ceacd[…]946b3897')
    await Assert.elementWithTextExists(page, 'p', 'Folder Name: test-folder')
    await Assert.elementWithTextExists(page, 'p', 'Kind: Folder')
    await Assert.elementWithTextExists(page, 'p', 'Size: 6.56 kB')
    await Assert.elementWithTextExists(page, 'h6', '4 items')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertUploadPreview(page) {
    await Assert.elementWithTextExists(page, 'p', 'Folder Name: test-folder')
    await Assert.elementWithTextExists(page, 'p', 'Kind: Folder')
    await Assert.elementWithTextExists(page, 'p', 'Size: 6.56 kB')
}
