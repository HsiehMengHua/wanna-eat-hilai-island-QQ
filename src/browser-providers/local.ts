import { type Browser, type Page } from 'playwright';
import { type IBrowserProvider } from './types.js';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import { type IProxyProvider } from '../proxy-providers/types.js';

export default class Local implements IBrowserProvider {
    private proxyProvider: IProxyProvider;

    constructor(proxyProvider: IProxyProvider) {
        this.proxyProvider = proxyProvider;
    }

    async launchPage(): Promise<[Browser, Page]> {
        chromium.use(stealth());
        const proxy = await this.proxyProvider.getRandomProxy();
        const ua = this.getRandomUserAgent();

        try {
            const browser = await chromium.launch({
                headless: true,  // Set to true for background running
                proxy: proxy
            });

            const context = await browser.newContext({
                userAgent: ua,
                extraHTTPHeaders: {
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept': 'text/html,application/xhtml+xml'
                }
            });

            return [browser, await context.newPage()];
        } catch (error) {
            throw new Error(`An error occurs when launching the browser. (proxy: ${proxy.server}, user agent: ${ua})`, { cause: error });
        }
    }

    private getRandomUserAgent(): string {
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.3595.94',
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.3595.94',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 OPR/125.0.0.0',
            'Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 OPR/123.0.0.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Vivaldi/7.6.3797.63',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.3595.94',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7; rv:145.0) Gecko/20100101 Firefox/145.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 OPR/125.0.0.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Vivaldi/7.6.3797.63',
        ];

        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }
}