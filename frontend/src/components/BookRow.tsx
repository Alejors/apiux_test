import type { Book } from '../types/Book';

interface BookRowProps {
    book: Book;
}

const BookRow = ({ book }: BookRowProps) => {
  return (
    <tr>
      <td>
        <img src={book.image_url ? book.image_url : 'https://placehold.co/400'} alt={book.title} className="size-16 object-cover rounded" />
      </td>
      <td>
        {book.title}
      </td>
      <td>
        {book.author}
      </td>
      <td>
        {book.editorial}
      </td>
      <td>
        {book.genre}
      </td>
      <td>
        ${book.price}
      </td>
      <td>
        {book.availability ? 'Disponible' : 'Agotado'}
      </td>
    </tr>
  );
};

export default BookRow;
