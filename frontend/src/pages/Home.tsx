import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import TitleBanner from '../components/TitleBanner';
import { apiFetch } from '../services/requests';
import type { ApiResponse } from '../types/ApiResponse';
import type { Book } from '../types/Book';
import BookRow from '../components/BookRow';


const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const books: Promise<ApiResponse<Book[]>> = apiFetch('/books');
    books.then((response) => {
      if (response.code === 'success') {
        setBooks(response.data);
      }
    })
  },[])

  const headers = [
    { key: 'image', label: 'Portada' },
    { key: 'title', label: 'Título' },
    { key: 'author', label: 'Autor' },
    { key: 'editorial', label: 'Editorial' },
    { key: 'genre', label: 'Género' },
    { key: 'price', label: 'Precio' },
    { key: 'availability', label: 'Stock' },
  ];

  return (
    <>
      <TitleBanner title="Bookstore" />
      <div className="flex justify-center items-center my-6">
        <table>
          <thead>
            <tr>
              {
                headers.map((header) => (
                  <th key={header.key} className="px-4 py-2 text-left text-white font-semibold">
                    {header.label}
                  </th>
                ))
              }
            </tr>
          </thead>
          <tbody className='text-center'>
            {
              books && books.length > 0 ? books.map((book, idx) => (
                <BookRow key={idx} book={book} />
              )) : null
            }
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;
