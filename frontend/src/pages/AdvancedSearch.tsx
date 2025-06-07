import { Notify } from "notiflix";
import { useEffect, useState, useRef } from "react";
import { from, Subject, EMPTY } from "rxjs";
import { debounceTime, switchMap, catchError } from "rxjs/operators";

import type {
  Book,
  ApiResponse,
} from '../types/index';
import { apiFetch } from '../services/requests';
import TitleBanner from '../components/TitleBanner';
import BooksTable from '../components/TanstackTable';


const searchTrigger$ = new Subject<Record<string, string>>();
type SetterFunc = (value: string) => void;

export default function AdvancedSearch() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [books, setBooks] = useState<Book[]>([]);

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const editorialRef = useRef<HTMLInputElement>(null);
  const genreRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const [titleSuffix, setTitleSuffix] = useState("eq");
  const [authorSuffix, setAuthorSuffix] = useState("eq");
  const [editorialSuffix, setEditorialSuffix] = useState("eq");
  const [genreSuffix, setGenreSuffix] = useState("eq");
  const [priceSuffix, setPriceSuffix] = useState("lt");
  const [orderSuffix, setOrderSuffix] = useState("asc");

  const suffixSetterFactory: Record<string, SetterFunc> = {
    "books.title__": setTitleSuffix,
    "author.name__": setAuthorSuffix,
    "editorial.name__": setEditorialSuffix,
    "genre.name__": setGenreSuffix,
    "books.price__": setPriceSuffix,
  }
  function handleSuffixChange(suffixValue: string, keyValue: string) {
    if (keyValue in suffixSetterFactory) {
      suffixSetterFactory[keyValue](suffixValue);
    } else {
      throw new Error("Trying to Set an Unknown Key");
    }
    const newFilters = { ...filters };
    Object.keys(newFilters).forEach((filterKey: string) => {
      if (filterKey.startsWith(keyValue)) {
        newFilters[`${keyValue}${suffixValue}`] = newFilters[filterKey]
        delete newFilters[filterKey];
      }
    });
    setFilters(newFilters);
    searchTrigger$.next(newFilters);
  }

  function resetSearch() {
    setBooks([]);
    setTitleSuffix("eq");
    setAuthorSuffix("eq");
    setEditorialSuffix("eq");
    setGenreSuffix("eq");
    setPriceSuffix("lt");
    setFilters({})
    if (titleRef.current) titleRef.current.value = "";
    if (authorRef.current) authorRef.current.value = "";
    if (editorialRef.current) editorialRef.current.value = "";
    if (genreRef.current) genreRef.current.value = "";
    if (priceRef.current) priceRef.current.value = "";
  }

  function handleOrderSuffixChange(value: string) {
    setOrderSuffix(value);
    const filtersCheck = {...filters}
    Object.keys(filtersCheck).forEach((key) => {
      if (key === "order_by") {
        const previousOrderValue = filtersCheck[key];
        const [orderCriteria] = previousOrderValue.split("__");
        const newOrderCriteria = `${orderCriteria}__${value}`;
        filtersCheck[key] = newOrderCriteria;
        setFilters(filtersCheck);
        searchTrigger$.next(filtersCheck);
      }
    })
  }

  function handleOrderChange(key: string, value: string) {
    const newFilters = { ...filters };

    if (value !== "" && value !== null && value !== undefined) {
      newFilters[key] = value + orderSuffix;
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
    searchTrigger$.next(newFilters);
  }

  function handleChange(key: string, value: string) {
    const [baseKey] = key.split("__");
    const newFilters = { ...filters };

    // Debemos eliminar el elemento de la búsqueda contraria para la misma columna (eq v/s like)
    Object.keys(newFilters).forEach((filterKey: string) => {
      if (filterKey.startsWith(baseKey + "__")) {
        delete newFilters[filterKey];
      }
    });

    if (value !== "" && value !== null && value !== undefined) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
    searchTrigger$.next(newFilters);
  }

  useEffect(() => {
    const subscription = searchTrigger$
      .pipe(
        debounceTime(500),
        switchMap((newFilters: Record<string, string>) => {
          const query = new URLSearchParams(newFilters).toString();
          const route = `/books/advanced?${query}`
          return from(apiFetch(route)).pipe(
            catchError((err: Error) => {
              Notify.failure("Error al Buscar Libros");
              console.error(err);
              return EMPTY;
            })
          );
        })
      )
      .subscribe((response: ApiResponse<Book[]>) => {
        if (response.code === "success") {
          setBooks(response.data);
        } else {
          Notify.warning("Búsqueda Sin Resultados");
          setBooks([])
        }
      });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <TitleBanner title="Búsqueda Avanzada" />  
      <div className="my-4">
        <div className="flex justify-between gap-8 my-8">
          <div className="lg:min-w-1/2">
            <label className="block font-medium">Título</label>
            <input
              ref={titleRef}
              placeholder="Título del Libro" 
              className="block w-full bg-white/20 p-2 rounded mt-1" 
              onChange={(e) => handleChange(`books.title__${titleSuffix}`, e.target.value.toLowerCase())}
            />
            <div className="flex w-full justify-evenly mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="titleOperator"
                  value="eq"
                  checked={titleSuffix === "eq"}
                  onChange={(e) => handleSuffixChange(e.target.value, "books.title__")}
                />
                <label className="text-sm font-semibold ms-2">
                  Igual
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="titleOperator"
                  value="like"
                  checked={titleSuffix === "like"}
                  onChange={(e) => handleSuffixChange(e.target.value, "books.title__")}
                />
                <label className="text-sm font-semibold ms-2">
                  Contiene
                </label>
              </div>
            </div>
          </div>
          <div className="lg:min-w-1/2">
            <label className="block font-medium">Autor</label>
            <input
              ref={authorRef}
              placeholder="Autor del Libro" 
              className="block w-full bg-white/20 p-2 rounded mt-1" 
              onChange={(e) => handleChange(`author.name__${authorSuffix}`, e.target.value.toLowerCase())}
            />
            <div className="flex w-full justify-evenly mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="authorOperator"
                  value="eq"
                  checked={authorSuffix === "eq"}
                  onChange={(e) => handleSuffixChange(e.target.value, "author.name__")}
                />
                <label className="text-sm font-semibold ms-2">
                  Igual
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="authorOperator"
                  value="like"
                  checked={authorSuffix === "like"}
                  onChange={(e) => handleSuffixChange(e.target.value, "author.name__")}
                />
                <label className="text-sm font-semibold ms-2">
                  Contiene
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-8 my-8">
          <div className="lg:min-w-1/2">
            <label className="block font-medium">Editorial</label>
            <input
              ref={editorialRef}
              placeholder="Editorial del Libro" 
              className="block w-full bg-white/20 p-2 rounded mt-1" 
              onChange={(e) => handleChange(`editorial.name__${editorialSuffix}`, e.target.value.toLowerCase())}
            />
            <div className="flex w-full justify-evenly mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="editorialOperator"
                  value="eq"
                  checked={editorialSuffix === "eq"}
                  onChange={(e) => handleSuffixChange(e.target.value, "editorial.name__")}
                />
                <label className="text-sm font-semibold ms-2">
                  Igual
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="editorialOperator"
                  value="like"
                  checked={editorialSuffix === "like"}
                  onChange={(e) => handleSuffixChange(e.target.value, "editorial.name__")}
                />
                <label className="text-sm font-semibold ms-2">
                  Contiene
                </label>
              </div>
            </div>
          </div>
          <div className="lg:min-w-1/2">
            <label className="block font-medium">Género</label>
            <input
              ref={genreRef}
              placeholder="Género del Libro" 
              className="block w-full bg-white/20 p-2 rounded mt-1" 
              onChange={(e) => handleChange(`genre.name__${genreSuffix}`, e.target.value.toLowerCase())}
            />
            <div className="flex w-full justify-evenly mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="genreOperator"
                  value="eq"
                  checked={genreSuffix === "eq"}
                  onChange={(e) => handleSuffixChange(e.target.value, "genre.name__")}
                />
                <label className="text-sm font-semibold ms-2">
                  Igual
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="genreOperator"
                  value="like"
                  checked={genreSuffix === "like"}
                  onChange={(e) => handleSuffixChange(e.target.value, "genre.name__")}
                />
                <label className="text-sm font-semibold ms-2">
                  Contiene
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-8 my-8">
          <div className="lg:min-w-1/2">
            <label className="block font-medium">Precio</label>
            <input
              ref={priceRef}
              type="number"
              min="0"
              placeholder="Precio del Libro" 
              className="block w-full bg-white/20 p-2 rounded mt-1" 
              onChange={(e) => handleChange(`books.price__${priceSuffix}`, e.target.value)}
            />
            <div className="flex w-full justify-evenly mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="priceOperator"
                  value="lt"
                  checked={priceSuffix === "lt"}
                  onChange={(e) => handleSuffixChange(e.target.value, "books.price__")}
                />
                <label className="text-sm font-semibold ms-2">
                  Menor a...
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="priceOperator"
                  value="lte"
                  checked={priceSuffix === "lte"}
                  onChange={(e) => handleSuffixChange(e.target.value, "books.price__")}
                />
                <label className="text-sm font-semibold ms-2">
                  Menor o igual a...
                </label>
              </div>
            </div>
            <div className="flex w-full justify-evenly mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="priceOperator"
                  value="gte"
                  checked={priceSuffix === "gte"}
                  onChange={(e) => handleSuffixChange(e.target.value, "books.price__")}
                />
                <label className="text-sm font-semibold ms-2">
                  Mayor o igual a...
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="priceOperator"
                  value="gt"
                  checked={priceSuffix === "gt"}
                  onChange={(e) => handleSuffixChange(e.target.value, "books.price__")}
                />
                <label className="text-sm font-semibold ms-2">
                  Mayor a...
                </label>
              </div>
            </div>
          </div>
          <div className="lg:min-w-1/2">
            <label className="block font-medium">Disponibilidad</label>
            <select className="w-full border border-gray-300 bg-white/20 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-700" onChange={(e) => {handleChange("books.availability", e.target.value)}} defaultValue={""}>
              <option className="text-black" value="">Todos</option>
              <option className="text-black" value="true">Disponible</option>
              <option className="text-black" value="false">Agotado</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between gap-8 my-8">
          <div className="lg:min-w-1/2">
            <label className="block font-medium">Ordenar Por: </label>
            <select className="w-full border border-gray-300 bg-white/20 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-700" onChange={(e) => handleOrderChange("order_by", e.target.value)} defaultValue={""}>
              <option className="text-black" value="">Ninguno</option>
              <option className="text-black" value="title__">Título</option>
              <option className="text-black" value="author__">Autor</option>
              <option className="text-black" value="editorial__">Editorial</option>
              <option className="text-black" value="genre__">Género</option>
              <option className="text-black" value="price__">Precio</option>
              <option className="text-black" value="availability__">Disponibilidad</option>
            </select>
          </div>
          <div className="flex flex-col w-full justify-evenly mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                name="orderOperator"
                value="asc"
                checked={orderSuffix === "asc"}
                onChange={(e) => handleOrderSuffixChange(e.target.value)}
              />
              <label className="text-sm font-semibold ms-2">
                Ascendiente
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="orderOperator"
                value="desc"
                checked={orderSuffix === "desc"}
                onChange={(e) => handleOrderSuffixChange(e.target.value)}
              />
              <label className="text-sm font-semibold ms-2">
                Descendiente
              </label>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => resetSearch()} className="bg-sky-200/70 text-white font-semibold px-4 py-2 rounded cursor-pointer">Borrar Resultados</button>
      {
        books && books.length > 0 ? (
          <div className="flex justify-center items-center my-4">
            <BooksTable data={books} includeExtras={false} />
          </div>
        ) : (
          <h1 className="text-white text-4xl font-semibold flex justify-center mt-4">Sin Libros Que Mostrar...</h1>
        )
      }
    </>
  );
}
