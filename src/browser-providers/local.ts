import { type Browser, type Page } from "playwright";
import { type IBrowserProvider } from "./types.js";
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

interface Proxy {
    server: string;
    bypass?: string;
    username?: string;
    password?: string;
}

export default class Local implements IBrowserProvider {
    async launchPage(): Promise<[Browser, Page]> {
        chromium.use(stealth());

        const browser = await chromium.launch({
            headless: true,  // Set to true for background running
            proxy: this.getRandomProxy()
        });

        const context = await browser.newContext({
            userAgent: this.getRandomUserAgent(),
            extraHTTPHeaders: {
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml'
            }
        });

        return [browser, await context.newPage()];
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

    private getRandomProxy(): Proxy {
        const proxies = [
            {
                server: '142.111.48.253:7030',
                username: 'dqlvgjks',
                password: '9jtw6e2v3k5s'
            },
            {
                server: '31.59.20.176:6754',
                username: 'dqlvgjks',
                password: '9jtw6e2v3k5s'
            },
            {
                server: '23.95.150.145:6114',
                username: 'dqlvgjks',
                password: '9jtw6e2v3k5s'
            },
            {
                server: '198.23.239.134:6540',
                username: 'dqlvgjks',
                password: '9jtw6e2v3k5s'
            },
            {
                server: '107.172.163.27:6543',
                username: 'dqlvgjks',
                password: '9jtw6e2v3k5s'
            },
            {
                server: '198.105.121.200:6462',
                username: 'dqlvgjks',
                password: '9jtw6e2v3k5s'
            },
            {
                server: '64.137.96.74:6641',
                username: 'dqlvgjks',
                password: '9jtw6e2v3k5s'
            },
            {
                server: '84.247.60.125:6095',
                username: 'dqlvgjks',
                password: '9jtw6e2v3k5s'
            },
            {
                server: '216.10.27.159:6837',
                username: 'dqlvgjks',
                password: '9jtw6e2v3k5s'
            },
            {
                server: '142.111.67.146:5611',
                username: 'dqlvgjks',
                password: '9jtw6e2v3k5s'
            },
        ];


        return proxies[Math.floor(Math.random() * proxies.length)];
    }
}