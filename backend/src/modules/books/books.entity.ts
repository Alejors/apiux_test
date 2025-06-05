export class Book {
  constructor(
    public readonly id: number,
    public title: string,
    public author_id: number,
    public editorial_id: number,
    public price: number,
    public availability: boolean,
    public genre_id: number,
  ) {}
}
