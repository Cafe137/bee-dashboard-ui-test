import { Assert, Click, Wait } from 'cafe-puppeteer'
import { System } from 'cafe-utility'
import puppeteer from 'puppeteer'

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
export async function selectStampAndUpload(page) {
    await Click.elementWithText(page, 'button', 'Add Postage Stamp')
    await Click.elementWithClass(page, 'div', '.MuiSelect-select')
    await Click.elementWithClass(page, 'li', '.MuiListItem-button')
    await Wait.forEnabledStateXPath(page, 'button', 'Proceed With Selected Stamp')
    // seems necessary, even though button is enabled by the previous step, it is only highlighted and not clicked
    await System.sleepMillis(500)
    await Click.elementWithText(page, 'button', 'Proceed With Selected Stamp')
    await Click.elementWithText(page, 'button', 'Upload To Your Node')
    await Assert.elementWithTextExists(page, 'button', 'Download')
    await Assert.elementWithTextExists(page, 'button', 'Update Feed')
}
