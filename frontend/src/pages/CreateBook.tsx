import { z } from "zod";
import { useState } from "react";
import { Notify } from "notiflix";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Book } from "../types/index";
import { apiFetch } from "../services/requests";

import TitleBanner from '../components/TitleBanner';

const bookSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  author: z.string().min(1, "El autor es obligatorio"),
  editorial: z.string().min(1, "La editorial es obligatoria"),
  genre: z.string().min(1, "El género es obligatorio"),
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

export default function BookCreateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(bookSchema),
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("editorial", data.editorial);
    formData.append("genre", data.genre);
    formData.append("price", String(data.price));
    formData.append("availability", String(data.availability));
    if (data.image?.length) {
      formData.append("image", data.image[0]);
    }

    try {
      const res = await apiFetch<Book>("/books", {
        method: "POST",
        body: formData,
      }, false);
      if (res.code === "success") {
        Notify.success("Libro creado");
        reset();
      } else {
        Notify.failure("Error al crear libro");
      }
    } catch (err) {
      console.error(err);
      Notify.failure("Error de red");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <TitleBanner title="Crear Libro" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-10 max-w-md mx-auto">
        <div>
          <label className="block font-medium">Título</label>
          <input {...register("title")} className="block w-full bg-white/20 p-2 rounded mt-1" />
          {errors.title && <p className="text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label>Autor</label>
          <input {...register("author")} className="block w-full bg-white/20 p-2 rounded mt-1" />
          {errors.author && <p className="text-red-600">{errors.author.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Editorial</label>
          <input {...register("editorial")} className="block w-full bg-white/20 p-2 rounded mt-1" />
          {errors.editorial && <p className="text-red-600">{errors.editorial.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Género</label>
          <input {...register("genre")} className="block w-full bg-white/20 p-2 rounded mt-1" />
          {errors.genre && <p className="text-red-600">{errors.genre.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Precio</label>
          <input type="number" step="0.01" {...register("price")} className="block w-full bg-white/20 p-2 rounded mt-1" />
          {errors.price && <p className="text-red-600">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block font-medium">
            <input type="checkbox" {...register("availability")} /> Disponible
          </label>
          {errors.availability && <p className="text-red-600">{errors.availability.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Imagen (JPEG o PNG)</label>
          <input type="file" accept="image/jpeg, image/png" {...register("image")} 
          className="block w-full bg-blue-200/60 p-2 rounded mt-1" />
          {errors.image && <p className="text-red-600">{errors.image.message}</p>}
        </div>

        <button type="submit" disabled={submitting} className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">
          {submitting ? "Guardando..." : "Crear libro"}
        </button>
      </form>
    </>
  );
}

