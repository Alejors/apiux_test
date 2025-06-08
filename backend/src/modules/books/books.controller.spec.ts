import { Test, TestingModule } from "@nestjs/testing";
import { BooksController } from "./books.controller";
import { BooksService } from "./books.service";
import { CsvExportService } from "../../common/services/csv-export.service";
import { AuthGuard } from "../../common/guards/auth.guard";
import { ExecutionContext } from "@nestjs/common";
import { SUCCESS_CODE } from "../../constants";

const mockBooksService = {
  create: jest.fn(),
  findAllPaginated: jest.fn(),
  findAdvanced: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  exportToCSV: jest.fn(),
};

const mockCsvExportService = {
  generateCsv: jest.fn(),
};

const mockDto = {
  title: "Test Title",
  author: "Author",
  editorial: "Editorial",
  genre: "Genre",
  price: 10,
  availability: true,
};

const mockBook = { id: 1, ...mockDto };

describe("BooksController", () => {
  let controller: BooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        { provide: BooksService, useValue: mockBooksService },
        { provide: CsvExportService, useValue: mockCsvExportService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<BooksController>(BooksController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create()", () => {
    it("should create a book successfully", async () => {
      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(mockDto, 123, undefined);

      expect(result.code).toBe(SUCCESS_CODE);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe(1);
      expect(mockBooksService.create).toHaveBeenCalledWith(
        mockDto,
        123,
        undefined,
      );
    });
  });

  describe("findAll()", () => {
    it("should return paginated books", async () => {
      mockBooksService.findAllPaginated.mockResolvedValue({
        meta: {},
        links: {},
        data: [mockBook],
      });

      const result = await controller.findAll(1, 10);

      expect(result.code).toBe(SUCCESS_CODE);
      expect(result.data?.length).toBe(1);
    });
  });

  describe("findOne()", () => {
    it("should return a single book", async () => {
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne(1);

      expect(result.code).toBe(SUCCESS_CODE);
      expect(result.data?.id).toBe(1);
    });
  });
});
