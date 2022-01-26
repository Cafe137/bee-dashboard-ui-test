import { Assert, Click, Wait } from 'cafe-puppeteer'
import { getImageMetadata } from 'cafe-sharp'
import { Assertions } from 'cafe-utility'
import fetch from 'node-fetch'
import puppeteer from 'puppeteer'
import { selectStampAndUpload } from '../library'

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
export async function testImageFileUpload(page) {
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
    await fileChooser.accept(['test-data/1337x1337.jpg'])
    await assertUploadPreview(page)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertUploadPreview(page) {
    await Assert.elementWithTextExists(page, 'p', 'Filename: 1337x1337.jpg')
    await Assert.elementWithTextExists(page, 'p', 'Kind: image/jpeg')
    await Assert.elementWithTextExists(page, 'p', 'Size: 116.88 kB')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertDownloadPreview(page) {
    await Assert.elementWithTextExists(page, 'p', 'Swarm Hash: 5de1d879[…]3427432d')
    await Assert.elementWithTextExists(page, 'p', 'Filename: 1337x1337.jpg')
    await Assert.elementWithTextExists(page, 'p', 'Kind: image/jpeg')
    await Assert.elementWithTextExists(page, 'p', 'Size: 116.88 kB')
    const image = await Wait.forElementXPath(page, '//img[contains(@alt, "Upload Preview")]')
    const imageSource = await page.evaluate(image => image.src, image)
    const response = await fetch(imageSource)
    const arrayBuffer = await response.arrayBuffer()
    const imageMetadata = await getImageMetadata(Buffer.from(arrayBuffer))
    Assertions.asTrue(imageMetadata.width === 175)
    Assertions.asTrue(imageMetadata.height === 175)
    Assertions.asTrue(imageMetadata.format === 'jpeg')
}
