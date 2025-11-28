import { IProxyProvider, Proxy } from "./types.js";

export default class WebShare implements IProxyProvider {
    async getAll(): Promise<Proxy[]> {
        const response = await fetch('https://proxy.webshare.io/api/v2/proxy/list/download/bkpnrusazepmditgiuckvkbicnanbkpbihyzaeop/-/any/username/direct/-/?plan_id=12307548');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const textContent = await response.text();
        const lines = textContent.split(/\r?\n/);
        if (lines[lines.length - 1] === '') {
            lines.pop();
        }

        return lines.map(x => {
            const [ip, port, username, password] = x.split(':');

            return {
                server: `${ip}:${port}`,
                username: username,
                password: password
            } as Proxy;
        });
    }

    async getRandomProxy(): Promise<Proxy> {
        const proxies = await this.getAll();
        return proxies[Math.floor(Math.random() * proxies.length)];
    }
}

new WebShare().getAll();