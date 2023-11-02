import { chromium, Browser, Page } from "playwright";
import Home from "./page/Home";
import Data from "./data.json";

let browser: Browser;
let page: Page;

export async function setupPlaywright() {
  browser = await chromium.launch();
  page = await browser.newPage();
  const homepage = new Home(page);
  await page.goto("https://magento.softwaretestingboard.com/");
  await homepage.customerLogin(
    Data.customerLogin.email,
    Data.customerLogin.password
  );
}

export async function teardownPlaywright() {
  const homepage = new Home(page);
  await homepage.signOut();
  await browser.close();
}

export { browser, page };
