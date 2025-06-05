import { Response } from "./response.interface";

export class ApiResponseType<T> implements Response<T> {
  message: string;
  code: string;
  data: T | null;
  constructor(message: string, code: string, data: T | null) {
    this.message = message;
    this.code = code;
    this.data = data;
  }
}
