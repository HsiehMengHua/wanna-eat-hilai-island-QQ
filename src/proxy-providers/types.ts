export interface Proxy {
    server: string;
    bypass?: string;
    username?: string;
    password?: string;
}

export interface IProxyProvider {
    getAll(): Promise<Proxy[]>
    getRandomProxy(): Promise<Proxy>
}