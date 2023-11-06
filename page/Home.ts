import { Locator, expect } from "@playwright/test";
import { sign } from "crypto";
import { Page } from "playwright";

export default class Home {
  private page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  public async goToSignIn() {
    await this.page
      .locator("#maincontent")
      .getByRole("link", { name: "Sing In" })
      .click();
    await expect(
      this.page.locator("strong#block-customer-login-heading")
    ).toHaveText("Registered Customers");
    await expect(
      this.page.locator("strong#block-new-customer-heading")
    ).toHaveText("New Customers");
  }

  public async goToCreateAnAccount() {
    const createAccountLocator =
      "//div[@class='panel header']//a[text()='Create an Account']";
    const createAccountElement = await this.page.locator(createAccountLocator);
    await createAccountElement.click();
    await expect(
      this.page.locator("span[data-ui-id='page-title-wrapper']")
    ).toHaveText("Create New Customer Account");
  }

  public async searchStore(sku: string) {
    await this.page.waitForSelector("#search");
    await this.page.getByPlaceholder("Search entire store here...").click();
    await this.page.getByPlaceholder("Search entire store here...").fill(sku);
    await this.page.getByRole("option", { name: sku }).click();
    await expect(
      this.page
        .locator("#maincontent div")
        .filter({ hasText: `Search results for: '${sku}'` })
    ).toBeVisible();
  }

  public async generateRandomUsername(length: number): Promise<string> {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789"; // Add more characters if needed
    let username = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      username += characters.charAt(randomIndex);
    }

    return username;
  }

  public async newCustomer(
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string
  ) {
    const randomUsername = await this.generateRandomUsername(2);
    const email = `darko_${randomUsername}@gmail.com`;

    await this.page.getByLabel("First Name").click();
    await this.page.getByLabel("First Name").fill(firstName);
    await this.page.getByLabel("Last Name").click();
    await this.page.getByLabel("Last Name").fill(lastName);
    await this.page.getByLabel("Email", { exact: true }).click();
    await this.page.getByLabel("Email", { exact: true }).fill(email);
    await this.page.locator("input[title='Password']").click();
    await this.page.locator("input[title='Password']").fill(password);
    await this.page.locator("input[title='Confirm Password']").click();
    await this.page
      .locator("input[title='Confirm Password']")
      .fill(confirmPassword);
    await this.page.getByRole("button", { name: "Create an Account" }).click();
    await expect(
      this.page.getByText("Thank you for registering with Main Website Store.")
    ).toBeVisible();
    return { email, password };
  }

  public async customerLogin(email: string, password: string) {
    await this.page
      .locator("(//li[@class='authorization-link']//a)[1]")
      .click();
    await this.page.getByLabel("Email", { exact: true }).click();
    await this.page.getByLabel("Email", { exact: true }).fill(email);
    await this.page.getByLabel("Password").click();
    await this.page.getByLabel("Password").fill(password);
    await this.page.getByRole("button", { name: "Sign In" }).click();
    await this.page.waitForSelector(
      '//div[@class="panel header"]//li[@class="greet welcome"]'
    );
    const welcomeMessage = await this.page.locator(
      '//div[@class="panel header"]//li[@class="greet welcome"]'
    );
    await expect(welcomeMessage).toBeVisible();
  }

  public async clickMiniCart() {
    await this.page.locator("div[data-block='minicart']").click();
    const cartIsEmpty = await this.page
      .locator("strong.subtitle.empty")
      .isVisible();
    if (cartIsEmpty) {
      expect(cartIsEmpty).toBe(true);
      this.page.getByTestId("btn-minicart-close");
    } else {
      const itemCountElements = await this.page.locator("#mini-cart .item");
      const itemCount = await itemCountElements.count();
      this.page.getByTestId("btn-minicart-close");
      return { cartIsEmpty, itemCount };
    }
  }

  public async goToHomepage() {
    await this.page.getByLabel("store logo").click();
  }

  public async signOut() {
    const dropDown =
      "//div[@class='panel header']//button[@class='action switch']";
    await this.page.locator(dropDown).click();
    const signOut =
      "(//ul[@class='header links']//a[contains(text(),'Sign Out')])[1]";
    await this.page.locator(signOut).click();
    await expect(this.page.getByText("You are signed out")).toBeVisible();
  }

  public async deleteItemsFromMiniCart() {
    await this.page.locator("div[data-block='minicart']").click();
    const cartIsEmpty = await this.page
      .locator("strong.subtitle.empty")
      .isVisible();

    if (cartIsEmpty) {
      expect(cartIsEmpty).toBe(true);
      this.page.getByTestId("btn-minicart-close");
    } else {
      const itemCountElements = await this.page.locator("#mini-cart .item");
      const itemCount = await itemCountElements.count();
      console.log(itemCount);
      if (itemCount > 0) {
        for (let i = 1; i <= itemCount; i++) {
          const remove = this.page.locator(
            `(//a[@class='action delete'])[${i}]`
          );
          console.log(remove);

          await remove.click();

          const modal = await this.page.waitForSelector(
            "aside.modal-popup.confirm._show",
            { state: "visible" }
          );
          const confirm = this.page.locator(".action-primary.action-accept");
          if (modal) {
            await confirm.click();
          }
        }
      }
    }
  }

  public async goToShoppingCart() {
    await expect(this.page.locator("//span[text()='items']")).toBeVisible();
    await this.page.locator("div[data-block='minicart']").click();
    const Cart = await this.page.locator('//span[text()="View and Edit Cart"]');
    await Cart.waitFor({ state: "visible" });
    await Cart.click();
  }

  public async getHotSellers(): Promise<number> {
    const itemElements = await this.page.locator('//li[@class="product-item"]');
    return await itemElements.count();
  }

  public async addToMiniCartFromHotSellers(
    index: number,
    size: string,
    color: string
  ) {
    const itemLocator = `//li[@class='product-item'][${index + 1}]`;
    const itemElement = await this.page.locator(itemLocator);
    if (await itemElement.isVisible()) {
      await itemElement.hover();
      const priceLocator = `(//span[@data-price-type='finalPrice'])[${index}]`;
      const priceElement = await this.page.locator(priceLocator);
      const price = await priceElement.textContent();
      const sizeElement = await this.page.locator(
        `(//div[@aria-label="${size}"])[${index}]`
      );
      await sizeElement.click();
      const colorElement = await this.page.locator(
        `//li[@class='product-item'][${index}]//div[@aria-label='${color}']`
      );
      await colorElement.click();
      const buttonElement = await this.page.locator(
        `(//span[text()='Add to Cart'])[${index}]`
      );
      await buttonElement.click();
      await expect(
        this.page.locator("div[data-ui-id='message-success']")
      ).toBeVisible();
      return { price, size, color };
    }
  }

  public async navigateMenu(
    category: string,
    subcategory?: string,
    subsubcategory?: string
  ) {
    const elementsToHover = [category, subcategory, subsubcategory].filter(
      (element) => element !== undefined
    );
    let title;
    for (const elementName of elementsToHover) {
      const element = await this.page.getByRole("menuitem", {
        name: elementName,
      });
      title = elementName;
      console.log(elementName);
      if (elementName === elementsToHover[elementsToHover.length - 1]) {
        await element.click();
      } else {
        await element.hover();
      }
    }
    const titleName = `//div[@class='page-title-wrapper']//span[text()='${title}']`;
    await expect(this.page.locator(titleName)).toBeVisible();
  }
}
