import { ConflictException, NotFoundException } from "@nestjs/common";

import { BooksService } from "./books.service";
import { BooksController } from "./books.controller";
import { FAILED_CODE, SUCCESS_CODE } from "../../constants";
import { createTestModule } from "../../../tests/utils/test-utils";
import { CsvExportService } from "../../common/services/csv-export.service";

import { BooksModule } from "./books.module";

import { UpdateBookDto } from "./dto/books.dto";
import { ResponseBookDTO } from "./dto/bookResponse.dto";
import { DetailedBook } from "./detailedBook.projection";

import { BookModel } from "../../models/book.model";
import { GenreModel } from "../../models/genre.model";
import { AuthorModel } from "../../models/author.model";
import { EditorialModel } from "../../models/editorial.model";

const mockCsvExportService = {
  exportToCsv: jest.fn(),
};

const mockDto = {
  title: "Test Title",
  author: "Author",
  editorial: "Editorial",
  genre: "Genre",
  price: 10,
  availability: true,
};

const mockBooks = [
  {
    title: "Book One",
    author: "Author A",
    editorial: "Editorial X",
    genre: "Fiction",
    price: 20,
    availability: true,
  },
  {
    title: "Book Two",
    author: "Author B",
    editorial: "Editorial X",
    genre: "Drama",
    price: 30,
    availability: true,
  },
  {
    title: "Book Three",
    author: "Author A",
    editorial: "Editorial Y",
    genre: "Fiction",
    price: 25,
    availability: false,
  },
];

describe("BooksController", () => {
  let controller: BooksController;
  let service: BooksService;

  beforeAll(async () => {
    const { moduleRef } = await createTestModule(
      [BookModel, GenreModel, AuthorModel, EditorialModel],
      [BooksModule],
      [{ provide: CsvExportService, useValue: mockCsvExportService }],
      [],
      true,
    );
    controller = moduleRef.get<BooksController>(BooksController);
    service = moduleRef.get<BooksService>(BooksService);

    // Carga de 3 libros de prueba antes de iniciar los tests.
    for (const dto of mockBooks) {
      await service.create(dto, 1);
    }
  });

  it("Validar que controlador y servicio se definieron correctamente", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("Crear Libro", () => {
    it("debería crear un libro", async () => {
      const result = await controller.create(mockDto, 123, undefined);

      expect(result.code).toBe(SUCCESS_CODE);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe(4);
    });

    it("debería fallar por ser el mismo libro", async () => {
      // como se mantiene la memoria de los tests, el test anterior ya creó el mockDto
      await expect(controller.create(mockDto, 123, undefined)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe("Buscar Libros", () => {
    it("Debería retornar listas paginadas", async () => {
      const result = await controller.findAll(1, 10);

      expect(result.code).toBe(SUCCESS_CODE);
      expect(result.data?.length).toBeGreaterThanOrEqual(4);
      expect(result.data?.map((b: DetailedBook) => b.title)).toEqual(
        expect.arrayContaining([
          "Book One",
          "Book Two",
          "Book Three",
          "Test Title",
        ]),
      );
      expect(result.links).toBeDefined();
    });

    it("Deberia traer sólo ciertos libros", async () => {
      const searchParams = {
        "editorial.name__like": "X",
        "books.price__lte": "30",
      };
      const result = await controller.advancedSearch(searchParams);
      expect(result.code).toBe(SUCCESS_CODE);
      expect(result.data?.map((b: DetailedBook) => b.title)).toEqual(
        expect.arrayContaining(["Book One", "Book Two"]),
      );
    });

    it("Búsqueda cambiando precio retorna otros libros", async () => {
      const searchParams = {
        "editorial.name__like": "X",
        "books.price__gte": "30",
      };
      const result = await controller.advancedSearch(searchParams);
      expect(result.code).toBe(SUCCESS_CODE);
      expect(result.data?.map((b: DetailedBook) => b.title)).toEqual(
        expect.arrayContaining(["Book Two"]),
      );
    });

    it("Diferente condición de búsqueda", async () => {
      const searchParams = {
        "editorial.name__like": "Y",
      };
      const result = await controller.advancedSearch(searchParams);
      expect(result.code).toBe(SUCCESS_CODE);
      expect(result.data?.map((b: DetailedBook) => b.title)).toEqual(
        expect.arrayContaining(["Book Three"]),
      );
    });

    it("Retornar Fail si no se encuentra ninguno", async () => {
      const searchParams = {
        "editorial.name__eq": "Editorial Falsa",
      };
      const result = await controller.advancedSearch(searchParams);
      expect(result.code).toBe(FAILED_CODE);
    });

    it("Debería dar un orden específico", async () => {
      const orderParams = {
        order_by: "genre__asc",
      };
      const result = await controller.advancedSearch(orderParams);
      expect(result.code).toBe(SUCCESS_CODE);
      expect(result.data?.map((b: DetailedBook) => b.title)).toEqual(
        expect.arrayContaining([
          "Book Two",
          "Book One",
          "Book Three",
          "Test Title",
        ]),
      );
      const firstBook = result.data?.shift();
      expect(firstBook?.title).toBe("Book Two");
    });

    it("Debería dar orden invertido", async () => {
      const orderParams = {
        order_by: "genre__desc",
      };
      const result = await controller.advancedSearch(orderParams);
      expect(result.code).toBe(SUCCESS_CODE);
      const firstBook = result.data?.shift();
      expect(firstBook?.title).toBe("Test Title");
    });

    it("Debería retornar un libro", async () => {
      const result = await controller.findOne(4);

      expect(result.code).toBe(SUCCESS_CODE);
      expect(result.data?.title).toBe("Test Title");
    });
  });

  describe("Editar Libro", () => {
    it("Debería Editar un Libro Existente", async () => {
      const edit: UpdateBookDto = {
        title: "Edit Title",
      };
      const result = await controller.update(1, edit, 1);
      expect(result.code).toBe(SUCCESS_CODE);
      expect(result.data).toBeInstanceOf(ResponseBookDTO);
      expect(result.data?.title).toBe("Edit Title");
    });

    it("Debería Fallar por Constraint", async () => {
      /* El libro 1 ya se llama Edit Title por el test anterior,
      ambos son de la misma editorial 
      y si intentamos poner el mismo título y autor, debería fallar */
      const edit: UpdateBookDto = {
        title: "Edit Title",
        author: "Author A",
      };
      await expect(controller.update(2, edit, 1)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe("Eliminar libros", () => {
    it("Debería Eliminar un libro", async () => {
      const result = await controller.remove(1, 1);
      expect(result).toBeUndefined();
      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it("Debería Fallar por no existir", async () => {
      await expect(controller.remove(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
