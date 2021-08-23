export type SubBreed = string;
export type Breed = [] | SubBreed[];
export type Breeds = { [key: string]: Breed; };
export interface FetchResult {
    status: "success" | "error";
    message: string[] | string | Breeds;
    code?: number;
}
export type Result = FetchResult;