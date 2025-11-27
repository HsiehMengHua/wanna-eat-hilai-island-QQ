import { type Browser, type Page } from "playwright";

export interface IBrowserProvider {
    launchPage(): Promise<[Browser, Page]>
}