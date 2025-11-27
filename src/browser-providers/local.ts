import { type Browser, type Page } from "playwright";
import { type IBrowserProvider } from "./types.js";
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

export default class Local implements IBrowserProvider {
    async launchPage(): Promise<[Browser, Page]> {
        chromium.use(stealth());

        const browser = await chromium.launch({
            headless: true  // Set to true for background running
        });

        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        return [browser, await context.newPage()];
    }
}