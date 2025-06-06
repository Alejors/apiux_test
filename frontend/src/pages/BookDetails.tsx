import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Notify } from "notiflix";
import { zodResolver } from "@hookform/resolvers/zod";

import { apiFetch } from "../services/requests";
import type { ApiResponse, Book } from "../types/index";
import TitleBanner from "../components/TitleBanner";
import BackButton from "../components/BackButton";

const bookSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio" }),
  author: z.string().min(1, { message: "El autor es obligatorio" }),
  editorial: z.string().min(1, { message: "La editorial es obligatoria" }),
  genre: z.string().min(1, { message: "El género es obligatorio" }),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  availability: z.boolean(),
  image: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file ||
        !(file instanceof FileList) ||
        file.length === 0 ||
        ["image/jpeg", "image/png"].includes(file[0]?.type),
      {
        message: "Solo se permiten imágenes PNG o JPEG",
      }
    ),
});

type FormData = z.infer<typeof bookSchema>;

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [editable, setEditable] = useState(false);

  const performRequest = async (data: FormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("editorial", data.editorial);
    formData.append("genre", data.genre);
    if (data.image?.length) {
      formData.append("image", data.image[0]);
    }

    try {
      const res = await apiFetch<ApiResponse<Book>>(
        `/books/${id}`,
        {
          method: "PUT",
          body: formData,
        },
        false
      );

      if (res.code === "success") {
        Notify.success("Libro creado");
        const bookData = res.data;
        setBook(bookData);
        reset({
          title: bookData.title,
          author: bookData.author,
          editorial: bookData.editorial,
          genre: bookData.genre,
          price: bookData.price,
          availability: bookData.availability,
          image: undefined,
        });
        setEditable(false);
      } else {
        Notify.failure("Error al Editar el libro");
      }
    } catch (error) {
      Notify.failure(error.message || "Error desconocido al editar el libro");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(bookSchema),
  });

  useEffect(() => {
    if (id) {
      apiFetch<ApiResponse<Book>>(`/books/${id}`).then((response) => {
        if (response.code === "success") {
          const bookData = response.data;
          setBook(bookData);
          reset({
            title: bookData.title,
            author: bookData.author,
            editorial: bookData.editorial,
            genre: bookData.genre,
            price: bookData.price,
            availability: bookData.availability,
            image: undefined,
          });
        }
      });
    }
  }, [id, reset]);

  if (!book) return <div>Cargando...</div>;

  return (
    <>
      <TitleBanner title={`Información de ${book.title}`} />
      <div className="flex justify-end mt-6 mb-2">
        <BackButton />
      </div>
      <div className="flex gap-6 max-w-3xl mx-auto">
        <img
          src={book.image_url ? book.image_url : "https://placehold.co/400"}
          alt={book.title}
          className="w-48 h-48 object-cover"
        />
        <div className="flex-1">
          {editable ? (
            <>
              <form
                onSubmit={handleSubmit(performRequest)}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="title" className="block font-medium">
                    Título
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    {...register("title")}
                    className="block w-full border border-gray-300 rounded p-2 mt-1"
                  />
                  {errors.title && (
                    <span className="text-red-600">{errors.title.message}</span>
                  )}
                </div>
                <div>
                  <label htmlFor="author" className="block font-medium">
                    Autor
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    {...register("author")}
                    className="block w-full border border-gray-300 rounded p-2 mt-1"
                  />
                  {errors.author && (
                    <span className="text-red-600">
                      {errors.author.message}
                    </span>
                  )}
                </div>
                <div>
                  <label htmlFor="editorial" className="block font-medium">
                    Editorial
                  </label>
                  <input
                    type="text"
                    id="editorial"
                    name="editorial"
                    {...register("editorial")}
                    className="block w-full border border-gray-300 rounded p-2 mt-1"
                  />
                  {errors.editorial && (
                    <span className="text-red-600">
                      {errors.editorial.message}
                    </span>
                  )}
                </div>
                <div>
                  <label htmlFor="genre" className="block font-medium">
                    Género
                  </label>
                  <input
                    type="text"
                    id="genre"
                    name="genre"
                    {...register("genre")}
                    className="block w-full border border-gray-300 rounded p-2 mt-1"
                  />
                  {errors.genre && (
                    <span className="text-red-600">{errors.genre.message}</span>
                  )}
                </div>
                <div>
                  <label className="block font-medium">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("price")}
                    className="block w-full p-2 border border-gray-300 rounded mt-1"
                  />
                  {errors.price && (
                    <p className="text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium">
                    <input type="checkbox" {...register("availability")} />{" "}
                    Disponible
                  </label>
                  {errors.availability && (
                    <p className="text-red-600">
                      {errors.availability.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="image" className="block font-medium">
                    Imagen - PNG o JPG (opcional)
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    {...register("image")}
                    className="block w-full bg-blue-200/60 p-2 rounded mt-1"
                    accept="image/png, image/jpeg"
                  />
                  {errors.file && (
                    <span className="text-red-600">{errors.file.message}</span>
                  )}
                </div>
                <button
                  type="submit"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Guardar
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Título: {book.title}</h2>
              <ul className="mt-4 space-y-2">
                <li className="text-white/80">
                  <strong className="text-xl">Autor: </strong>
                  {book.author}
                </li>
                <li className="text-white/80">
                  <strong className="text-xl">Editorial: </strong>
                  {book.editorial}
                </li>
                <li className="text-white/80">
                  <strong className="text-xl">Género: </strong>
                  {book.genre}
                </li>
                <li className="text-white/80">
                  <strong className="text-xl">Precio: </strong>${book.price}
                </li>
                <li className="text-white/80">
                  <strong className="text-xl">Stock: </strong>
                  <span className={`ms-4 font-bold ${book.availability ? 'text-green-600' : 'text-red-600'}`}>
                    {book.availability ? 'Disponible' : 'Agotado'}
                  </span>
                </li>
              </ul>
            </>
          )}
          <button
            onClick={() => setEditable(!editable)}
            className={
              "cursor-pointer mt-4 text-white px-4 py-2 rounded" +
              (editable ? " bg-red-500" : " bg-blue-500")
            }
          >
            {editable ? "Cancelar" : "Editar"}
          </button>
        </div>
      </div>
    </>
  );
}
