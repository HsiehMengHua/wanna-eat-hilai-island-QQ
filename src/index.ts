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
        { PageUrl: 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-NeqTStJZDIBQHEMSDI8', BookingSize: 2 }, // 台北島語
        { PageUrl: 'https://inline.app/booking/-NeqTSgDQOAYi30lg4a7:inline-live-3/-OUYVD5L8af9l-fOxBi5', BookingSize: 2 }, // 高雄島語
        { PageUrl: 'https://tw.eztable.com/restaurant/17565', BookingSize: 2 }, // 台北島語
        // { PageUrl: 'https://tw.eztable.com/restaurant/9805', BookingSize: 4 },
    ]);
})();