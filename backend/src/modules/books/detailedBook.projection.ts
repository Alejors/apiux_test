export class DetailedBook {
  constructor(
    public readonly title: string,
    public readonly price: number,
    public readonly availability: boolean,
    public readonly author: string,
    public readonly genre: string,
    public readonly editorial: string,
    public readonly id?: number,
    public readonly image_url?: string,
  ) {}
}
