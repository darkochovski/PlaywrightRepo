import { expect, test } from "@playwright/test";
import { page, setupPlaywright, teardownPlaywright } from "../playwrightSetup";
import Home from "../page/Home";
import Data from "../data.json";

test.beforeAll(setupPlaywright);
test.afterAll(teardownPlaywright);

test("Log in and search for an item", async () => {
  const homepage = new Home(page);
  const itemCount = await homepage.clickMiniCart();
  if (itemCount?.cartIsEmpty == false) {
    expect(itemCount.itemCount).toBeGreaterThan(0);
  }
  await homepage.searchStore(Data.item.sku);
  await homepage.goToHomepage();
});

test("Add to MiniCart from HotSellers", async () => {
  const homepage = new Home(page);
  await homepage.deleteItemsFromMiniCart();
  const itemCount = await homepage.getHotSellers();
  console.log(itemCount);
  const addItem = await homepage.addToMiniCartFromHotSellers(
    2,
    Data.hotSeller.size,
    Data.hotSeller.color
  );
  console.log(addItem);
  await homepage.goToShoppingCart();
  await homepage.goToHomepage();
});

test("Log in to verify the user exist after new registration", async () => {
  const homepage = new Home(page);
  await homepage.signOut();
  await homepage.goToCreateAnAccount();
  const customer = await homepage.newCustomer(
    Data.newCustomer.firstName,
    Data.newCustomer.lastName,
    Data.newCustomer.password,
    Data.newCustomer.confirmPassword
  );
  await homepage.signOut();
  await homepage.customerLogin(customer.email, customer.password);
});
