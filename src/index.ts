import Notification from './availability-result-handlers/notification';
import Local from './browser-providers/local';
import WebShare from './proxy-providers/webshare';
import CheckerFactory from './availability-checkers/checker-factory';
import Handler from './handler';

(async () => {
    const proxyProvider = new WebShare();
    const browserProvider = new Local(proxyProvider);
    const resultHandler = new Notification();
    const checkerFactory = new CheckerFactory(browserProvider, resultHandler);

    await new Handler(checkerFactory).checkMultiple([
        { name: 'Inline - 台北島語', pageUrl: 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-NeqTStJZDIBQHEMSDI8', bookingSize: 2 },
        { name: 'Inline - 高雄島語', pageUrl: 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-OUYVD5L8af9l-fOxBi5', bookingSize: 2 },
        { name: 'EZTable - 台北島語', pageUrl: 'https://tw.eztable.com/restaurant/17565', bookingSize: 2 },
        // { name: '隨便測試用', pageUrl: 'https://tw.eztable.com/restaurant/9805', bookingSize: 4 },
    ]);
})();