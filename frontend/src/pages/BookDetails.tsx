import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  image: z
    .any()
    .optional()
    .refine(
      (files) => ["image/png", "image/jpeg"].includes(files?.[0]?.type),
      "Solo se permiten imágenes PNG o JPEG"
    ),
});

type FormData = z.infer<typeof bookSchema>;

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [editable, setEditable] = useState(false);

  const performRequest = (data: FormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("editorial", data.editorial);
    formData.append("genre", data.genre);
    if (data.image?.length) {
      formData.append("image", data.file[0]);
    }
    console.log(`Formulario enviado: ${JSON.stringify(formData)}`);
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
      <div className="flex gap-6 max-w-3xl mx-auto my-10">
        <img
          src={book.image_url}
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
                  <label htmlFor="title" className="block font-medium">Título</label>
                  <input
                    type="text"
                    name="title"
                    {...register("title")}
                    className="block w-full border border-gray-300 rounded p-2 mt-1"
                  />
                  {errors.title && (
                    <span className="text-red-600">{errors.title.message}</span>
                  )}
                </div>
                <div>
                  <label htmlFor="author" className="block font-medium">Autor</label>
                  <input
                    type="text"
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
                  <label htmlFor="editorial" className="block font-medium">Editorial</label>
                  <input
                    type="text"
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
                  <label htmlFor="genre" className="block font-medium">Género</label>
                  <input
                    type="text"
                    name="genre"
                    {...register("genre")}
                    className="block w-full border border-gray-300 rounded p-2 mt-1"
                  />
                  {errors.genre && (
                    <span className="text-red-600">{errors.genre.message}</span>
                  )}
                </div>
                <div>
                  <label htmlFor="image" className="block font-medium">Imagen (opcional)</label>
                  <input
                    type="file"
                    name="image"
                    {...register("image")}
                    className="block w-full bg-blue-200/60 p-2 rounded mt-1"
                    accept="image/png, image/jpeg"
                  />
                  {errors.file && (
                    <span className="text-red-600">{errors.file.message}</span>
                  )}
                </div>
                <input
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                />
                  
                
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Título: {book.title}</h2>
              <p className="text-white/80">
                <strong>Autor: </strong>
                {book.author}
              </p>
              <p className="text-white/80">
                <strong>Editorial: </strong>
                {book.editorial}
              </p>
              <p className="text-white/80">
                <strong>Género: </strong>
                {book.genre}
              </p>
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
      <BackButton />
    </>
  );
}
