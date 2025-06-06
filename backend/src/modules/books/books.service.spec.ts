import { Test, TestingModule } from "@nestjs/testing";
import { BooksService } from "./books.service";
import { BOOKS_INTERFACE } from "src/constants";
import { GcsService } from "src/frameworks/cloud-storage/gcs.service";
import { CsvExportService } from "src/common/services/csv-export.service";
import { NotFoundException } from "@nestjs/common";

const mockBook = {
  id: 1,
  title: "Test",
  author: "Author",
  editorial: "Editorial",
  price: 10,
  availability: true,
  genre: "Genre",
  image_url: "url",
};

const booksRepositoryMock = {
  create: jest.fn().mockResolvedValue({ id: 1 }),
  findOne: jest.fn().mockResolvedValue(mockBook),
  findAll: jest.fn().mockResolvedValue([mockBook]),
  findAllPaginated: jest.fn().mockResolvedValue([[mockBook], 1]),
  update: jest.fn().mockResolvedValue({ id: 1 }),
  remove: jest.fn().mockResolvedValue(undefined),
};

const gcsServiceMock = {
  upload: jest.fn().mockResolvedValue("uploaded_url"),
};

const csvExportServiceMock = {
  exportToCsv: jest.fn().mockReturnValue("csv-content"),
};

describe("BooksService", () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: BOOKS_INTERFACE, useValue: booksRepositoryMock },
        { provide: GcsService, useValue: gcsServiceMock },
        { provide: CsvExportService, useValue: csvExportServiceMock },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a book and upload image if buffer is provided", async () => {
    const dto = { ...mockBook };
    const result = await service.create(dto as any, 1, Buffer.from("img"));
    expect(gcsServiceMock.upload).toHaveBeenCalled();
    expect(booksRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({ image_url: "uploaded_url" }),
      1,
    );
    expect(result).toEqual(mockBook);
  });

  it("should create a book without uploading image if buffer is not provided", async () => {
    const dto = { ...mockBook };
    const result = await service.create(dto as any, 1);
    expect(gcsServiceMock.upload).not.toHaveBeenCalled();
    expect(booksRepositoryMock.create).toHaveBeenCalled();
    expect(result).toEqual(mockBook);
  });

  it("should return all books", async () => {
    const result = await service["findAll"]();
    expect(result).toEqual([mockBook]);
  });

  it("should export books to CSV", async () => {
    const result = await service.exportToCSV();
    expect(csvExportServiceMock.exportToCsv).toHaveBeenCalled();
    expect(result).toBe("csv-content");
  });

  it("should return paginated books", async () => {
    const result = await service.findAllPaginated(1, 10);
    expect(result.data).toEqual([mockBook]);
    expect(result.meta["totalCount"]).toBe(1);
    expect(result.meta["currentPage"]).toBe(1);
  });

  it("should return a book by id", async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockBook);
  });

  it("should throw NotFoundException if book does not exist", async () => {
    booksRepositoryMock.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it("should update a book and upload image if buffer is provided", async () => {
    const dto = { title: "Updated" };
    const result = await service.update(1, dto as any, 1, Buffer.from("img"));
    expect(gcsServiceMock.upload).toHaveBeenCalled();
    expect(booksRepositoryMock.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ image_url: "uploaded_url" }),
      1,
    );
    expect(result).toEqual(mockBook);
  });

  it("should update a book without uploading image if buffer is not provided", async () => {
    const dto = { title: "Updated" };
    const result = await service.update(1, dto as any, 1);
    expect(gcsServiceMock.upload).not.toHaveBeenCalled();
    expect(booksRepositoryMock.update).toHaveBeenCalled();
    expect(result).toEqual(mockBook);
  });

  it("should remove a book", async () => {
    await expect(service.remove(1, 1)).resolves.toBeUndefined();
    expect(booksRepositoryMock.remove).toHaveBeenCalledWith(1, 1);
  });
});
