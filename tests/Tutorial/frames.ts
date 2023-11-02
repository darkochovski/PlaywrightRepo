import { expect, test } from "@playwright/test"

test("Interact with inputs", async ({ page }) => {
    await page.goto("https://letcode.in/frame")
    const allframes = page.frames()
    console.log(allframes.length)
    const frame = page.frameLocator('#firstFr')
    await frame.locator("input[name='fname']").fill("darko")
    await frame.locator("input[name='lname']").fill("koch")

    const innerFrame = frame.frameLocator("iframe[src='innerFrame']")
    await innerFrame.locator("input[name='email']").fill("darko@gmail.com")

    await frame.locator("input[name='fname']").fill("Letcode")

    // another way of interacting with frame

    // const myFrame = page.frame("firstFr")
    // if (myFrame != null) {
    //     await myFrame.fill("", "")
    // }
    // await myFrame?.fill("input[name='fname']", "darko")
    // await myFrame?.fill("input[name='lname']", "koch")
    // expect(await myFrame?.locator("p.has-text-info").textContent()).toContain("You have entered")
})