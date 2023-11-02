import { expect, test } from "@playwright/test"

test ("Interact with inputs", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/simple-form-demo")
    const messageInput = await page.locator("input#user-message")
    await messageInput.scrollIntoViewIfNeeded()
    console.log(await messageInput.getAttribute("placeholder"))
    expect(messageInput).toHaveAttribute("placeholder", "Please enter your Message")
    console.log(await messageInput.inputValue())
    await messageInput.type("Hi Darko")
})

test("Sum", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/simple-form-demo")
    const sumFirstInput = page.locator("#sum1")
    const sumSecondInput = page.locator("#sum2")
    const getValuesBtn = page.locator("form#gettotal>button")
    let FirstInput = 121
    let SecondtInput = 546
    await sumFirstInput.type("" + FirstInput)
    await sumSecondInput.type("" + SecondtInput)
    const result = page.locator("#addmessage")
    await getValuesBtn.click()
    let expectedResult = FirstInput + SecondtInput
    expect(result).toHaveText("" + expectedResult)
})

test("Checkbox", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/checkbox-demo")
    const singleCheckbox = await page.locator("#isAgeSelected")
    expect(singleCheckbox).not.toBeChecked()
    await singleCheckbox.check()
    expect(singleCheckbox).toBeChecked()
})
