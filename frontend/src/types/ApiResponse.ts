import type { Meta } from "./Meta";
import type { Navigation } from "./Navigation";

export interface ApiResponse<T> {
    message: string;
    code: string;
    data: T;
    links?: Navigation;
    meta?: Meta;
}
