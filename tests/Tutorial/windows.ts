import { Page, expect, test } from "@playwright/test"

test("Interact with tabs", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/window-popup-modal-demo")
    console.log(page.url())
    const [newWindow] = await Promise.all([
        page.waitForEvent("popup"),
        page.click("'Follow On Twitter'")
    ])
    console.log(newWindow.url())
    // newWindow.fill("","")
})

let facebookPage: Page
test.only("Interact with multiple tabs", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/window-popup-modal-demo")
    const [multiPage] = await Promise.all([
        page.waitForEvent("popup"),
        page.click("#followboth")
    ])
    await multiPage.waitForLoadState()
    await page.setDefaultTimeout(10000)
    const pages = multiPage.context().pages()
    console.log('No.of tabs'+ pages.length)
    pages.forEach(tab => {
        console.log(page.url())       
    })
    for (let index = 0; index < pages.length; index++){
        const url = pages[index].url()
        if (url == "https://www.facebook.com/Lambdatest/") {
            facebookPage = pages[index]
        }
    }
    const text = await facebookPage.textContent("//h1")
    console.log(text)
})
