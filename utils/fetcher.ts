import type { Result } from "../types";

export default async function fetcher(url: string) {
    const endpoint = "https://dog.ceo/api" + url;
    const response = await fetch(endpoint);
    const result: Result = await response.json();
    return result;
}