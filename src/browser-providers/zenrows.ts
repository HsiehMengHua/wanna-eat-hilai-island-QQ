import { type Browser, type Page } from "playwright";
import { type IBrowserProvider } from "./types.js";
import { chromium } from 'playwright-extra';

export default class ZenRows implements IBrowserProvider {
    async launchPage(): Promise<[Browser, Page]> {
        const connectionURL = 'wss://browser.zenrows.com?apikey=8c3d558b6834453f3d8062eee3ecdf6e91b1fa42';
        const browser = await chromium.connectOverCDP(connectionURL);
        return [browser, await browser.newPage()];
    }
}