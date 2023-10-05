import puppetteer from "puppeteer";
import { fork } from "child_process";

jest.setTimeout(30000); // default puppeteer timeout

describe("Credit Card Validator form", () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = "http://localhost:8080";

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on("error", reject);
      server.on("message", (message) => {
        if (message === "ok") {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      headless: "new", // show gui
      slowMo: 250,
      devtools: false, // show devTools
    });
    page = await browser.newPage();
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
  });

  test("valid master-card", async () => {
    await page.goto(baseUrl);
    const btn = await page.$("button");
    await btn.click();
    await page.$(".popover");
  });
  afterAll(async () => {
    await browser.close();
    await server.kill();
  });
});
