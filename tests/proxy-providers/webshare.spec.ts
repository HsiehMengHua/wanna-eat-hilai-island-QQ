import WebShare from '../../src/proxy-providers/webshare';

describe('Test Proxy Provider - WebShare', () => {
    const originalFetch = global.fetch;
    const mockFetch = jest.fn();

    beforeAll(() => {
        global.fetch = mockFetch as unknown as typeof fetch;
    });

    afterAll(() => {
        global.fetch = originalFetch;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('get all and return in the type `Proxy`', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            text: jest.fn().mockResolvedValue(`142.111.48.253:7030:test_username:test_pwd
31.59.20.176:6754:test_username:test_pwd
23.95.150.145:6114:test_username:test_pwd`),
        });

        const sut = new WebShare();
        const result = await sut.getAll();

        expect(result).toHaveLength(3);
        expect(result).toEqual([
            { server: '142.111.48.253:7030', username: 'test_username', password: 'test_pwd' },
            { server: '31.59.20.176:6754', username: 'test_username', password: 'test_pwd' },
            { server: '23.95.150.145:6114', username: 'test_username', password: 'test_pwd' },
        ]);
    });
});