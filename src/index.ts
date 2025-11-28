import InlineChecker from './availability-checkers/inline-checker.js';
import Notification from './availability-result-handlers/notification.js';
import Local from './browser-providers/local.js';
import WebShare from './proxy-providers/webshare.js';

function check(targets: { PageUrl: string, BookingSize: number }[]) {
    const proxyProvider = new WebShare();
    const browserProvider = new Local(proxyProvider);
    const resultHandler = new Notification();
    const inlineChecker = new InlineChecker(browserProvider, resultHandler);

    for (const target of targets) {
        if (target.PageUrl.includes('https://inline.app')) {
            inlineChecker.check(target.PageUrl, target.BookingSize);
            continue;
        }

        throw new Error(`Invalid URL '${target.PageUrl}'. The reservation website is not supported.`);
    }
}

check([
    { PageUrl: 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-NeqTStJZDIBQHEMSDI8', BookingSize: 2 }, // Taipei
    { PageUrl: 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-OUYVD5L8af9l-fOxBi5', BookingSize: 2 } // kaohsiung
]);