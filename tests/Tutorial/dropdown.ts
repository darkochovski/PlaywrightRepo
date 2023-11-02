import { expect, test } from "@playwright/test"

test("Select dropdown", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/select-dropdown-demo")
    await page.selectOption("#select-demo", {
        // label: "Tuesday"
        //  value: "Friday"
       index: 5
    })
    await page.waitForTimeout(3000)
    await page.selectOption("#multi-select", [{
        label: "Texas"
    }, {
        index: 2
    }, {
        value: "Washington"
    }])
})

test("Boostrap dropwdown", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/jquery-dropdown-search-demo")
    await page.click("#country+span")
    await page.locator("ul#select2-country-results", {
       has: page.locator("li", {
        hasText: "India"
       }) 
    }).click()  
    await page.waitForTimeout(3000)
    })