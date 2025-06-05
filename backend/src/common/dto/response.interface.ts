export interface Response<T> {
  message: string;
  code: string;
  data: T | null;
}
