import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type {
  Book,
  Navigation,
  ApiResponse,
  Meta,
} from '../types/index';
import PrevArrow from '../components/PrevArrow';
import { apiFetch } from '../services/requests';
import { useAuth } from '../context/AuthContext';
import FirstArrow from '../components/FirstArrow';
import TitleBanner from '../components/TitleBanner';
import NextArrow from '../components/NextArrow';
import LastArrow from '../components/LastArrow';
import BooksTable from '../components/TanstackTable';


const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState<Book[]>([]);
  const [navigation, setNavigation] = useState<Navigation|null>(null);
  const [meta, setMeta] = useState<Meta|null>(null);
  const [route, setRoute] = useState<string>('/books?');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const books: Promise<ApiResponse<Book[]>> = apiFetch(route);
    books.then((response) => {
      if (response.code === 'success') {
        setBooks(response.data);
        setNavigation(response.links ?? null);
        setMeta(response.meta ?? null);
      }
    })
  },[route])

  return (
    <>
      <TitleBanner title="Listado de Libros" />
      <div className="flex justify-center items-center my-4">
        <BooksTable data={books} includeExtras={true} />
      </div>
      <div className="flex justify-between items-center mb-4">
        {
          meta ? (
            <div className='flex flex-col items-center justify-center'>
              <span className="text-gray-700">
                Página {meta.currentPage} de {meta.totalPages}
              </span>
              <span className="ml-4 text-gray-700">
                Total: {meta.totalCount} Libros.
              </span>
            </div>
          ) : <div></div>
        }
        <select className='border border-gray-300 bg-green-600/70 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-700' onChange={(e) => {setRoute(`${route.slice(0, route.indexOf("?"))}?limit=${e.target.value}`)}} defaultValue={'10'}>
          <option value="5">5 Libros por Página</option>
          <option value="10">10 Libros por Página</option>
          <option value="20">20 Libros por Página</option>
          <option value="50">50 Libros por Página</option>
          <option value="100">100 Libros por Página</option>
        </select>
      </div>
      <div className='flex justify-between w-full mb-10'>
        {
          navigation && navigation.first && navigation.first !== navigation.last ? (
            <FirstArrow title="Primera Página" className="size-4 cursor-pointer" onClick={() => setRoute(navigation.first)}/>
          ) : null
        }
        {
          navigation && navigation.previous ? (
            <PrevArrow title="Página Previa" className="size-4 cursor-pointer" onClick={() => setRoute(navigation.previous as string)} />
          ) : null
        }
        {
          navigation && navigation.next ? (
            <NextArrow title="Siguiente Página" className="size-4 cursor-pointer" onClick={() => setRoute(navigation.next as string)} />
          ) : null
        }
        {
          navigation && navigation.last && navigation.first !== navigation.last ? (
            <LastArrow title="Última Página" className="size-4 cursor-pointer" onClick={() => setRoute(navigation.last)} />
          ) : null
        }
      </div>
      
    </>
  );
};

export default Home;
