export class Book {
  constructor(
    public readonly id: number,
    public title: string,
    public authorId: number,
    public editorialId: number,
    public price: number,
    public availability: boolean,
    public genreId: number,
  ) {}
}
