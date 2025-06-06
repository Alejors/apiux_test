export interface Book {
  id: number;
  title: string;
  author: string;
  editorial: string;
  genre: string;
  price: number;
  availability: boolean;
  image_url?: string;
}
