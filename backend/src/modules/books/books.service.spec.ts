import { BooksService } from "./books.service";
import { BookModel } from "../../models/book.model";
import { AuthorModel } from "../../models/author.model";
import { GenreModel } from "../../models/genre.model";
import { EditorialModel } from "../../models/editorial.model";
import { CreateBookDto, UpdateBookDto } from "./dto/books.dto";
import { BOOKS_INTERFACE } from "../../constants";
import { UploadService } from "../upload/upload.service";
import { createTestModule } from "../../../tests/utils/test-utils";
import { CsvExportService } from "../../common/services/csv-export.service";
import { BookSequelizeRepository } from "./repositories/sequelizeBook.repository";

const gcsServiceMock = {
  upload: jest.fn().mockResolvedValue("uploaded_url"),
};

describe("BooksService", () => {
  let service: BooksService;

  beforeEach(async () => {
    const app = await createTestModule(
      [BookModel, GenreModel, AuthorModel, EditorialModel],
      [],
      [
        {
          provide: BOOKS_INTERFACE,
          useClass: BookSequelizeRepository,
        },
        {
          provide: UploadService,
          useValue: gcsServiceMock,
        },
        {
          provide: CsvExportService,
          useValue: {
            exportToCsv: jest.fn().mockResolvedValue("csv_content"),
          },
        },
        BooksService,
      ],
    );

    service = app.moduleRef.get<BooksService>(BooksService);
  });

  async function loadBook() {
    await service.create(
      {
        title: "Test book",
        author: "Test Author",
        genre: "Test Genre",
        editorial: "Test Editorial",
        price: 10,
        availability: true,
      },
      1,
    );
  }

  it("debería crear un libro con imagen", async () => {
    const dto: CreateBookDto = {
      title: "Test book",
      author: "Test Author",
      genre: "Test Genre",
      editorial: "Test Editorial",
      price: 10,
      availability: true,
    };

    const imageBuffer = Buffer.from("mock image");

    const result = await service.create(dto, 1, imageBuffer);

    expect(result).toBeDefined();
    expect(result?.title).toBe("Test book");
    expect(result?.image_url).toBe("uploaded_url");
  });

  it("debería crear un libro sin imagen", async () => {
    const dto: CreateBookDto = {
      title: "No image book",
      author: "Test Author",
      genre: "Test Genre",
      editorial: "Test Editorial",
      price: 10,
      availability: true,
    };

    const result = await service.create(dto, 2);

    expect(result).toBeDefined();
    expect(result?.title).toBe("No image book");
    expect(result?.image_url).toBeNull();
  });

  it("debería devolver error si el libro no existe", async () => {
    await expect(service.findOne(999)).rejects.toThrow("Book Doesn't Exist");
  });

  it("debería exportar libros a CSV", async () => {
    await loadBook();

    const result = await service.exportToCSV();
    expect(result).toBe("csv_content");
  });

  it("debería retornar un listado paginado", async () => {
    await loadBook();

    const result = await service.findAllPaginated(1, 10);
    expect(result.data[0].title).toEqual("Test book");
    expect(result.meta["totalCount"]).toBe(1);
    expect(result.meta["currentPage"]).toBe(1);
  });

  it("debería actualizar un libro con una nueva imagen", async () => {
    await loadBook();

    const dto: UpdateBookDto = { title: "Updated" };
    const result = await service.update(1, dto, 1, Buffer.from("img"));
    expect(gcsServiceMock.upload).toHaveBeenCalled();
    expect(result?.image_url).toEqual("uploaded_url");
    expect(result?.title).toEqual("Updated");
  });

  it("debería eliminarse un libro", async () => {
    await loadBook();

    const exist = await service.findOne(1);
    expect(exist).toBeTruthy();

    await expect(service.remove(1, 1)).resolves.toBeUndefined();
    await expect(service.findOne(1)).rejects.toThrow("Book Doesn't Exist");
  });
});
