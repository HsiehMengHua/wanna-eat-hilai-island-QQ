import EztableChecker from './availability-checkers/eztable-checker.js';
import InlineChecker from './availability-checkers/inline-checker.js';
import Notification from './availability-result-handlers/notification.js';
import Local from './browser-providers/local.js';
import WebShare from './proxy-providers/webshare.js';

async function check(targets: { PageUrl: string, BookingSize: number }[]) {
    const proxyProvider = new WebShare();
    const browserProvider = new Local(proxyProvider);
    const resultHandler = new Notification();
    const inlineChecker = new InlineChecker(browserProvider, resultHandler);
    const eztableChecker = new EztableChecker(browserProvider, resultHandler);

    const promises: Promise<void>[] = [];

    for (const target of targets) {
        if (target.PageUrl.includes('https://inline.app')) {
            promises.push(inlineChecker.check(target.PageUrl, target.BookingSize));
            continue;
        }

        if (target.PageUrl.includes('https://tw.eztable.com')) {
            promises.push(eztableChecker.check(target.PageUrl, target.BookingSize));
            continue;
        }

        console.error(`Invalid URL '${target.PageUrl}'. The reservation website is not supported.`);
    }

    await Promise.all(promises);
}

await check([
    { PageUrl: 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-NeqTStJZDIBQHEMSDI8', BookingSize: 2 }, // 台北島語
    { PageUrl: 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-OUYVD5L8af9l-fOxBi5', BookingSize: 2 }, // 高雄島語
    { PageUrl: 'https://tw.eztable.com/restaurant/17565', BookingSize: 2 }, // 台北島語
    // { PageUrl: 'https://tw.eztable.com/restaurant/9805', BookingSize: 4 },
]);
