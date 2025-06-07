import {
  Controller,
  Get,
  Res,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  UploadedFile,
  UseInterceptors,
  Query,
} from "@nestjs/common";
import { Response } from "express";
import type { Multer } from "multer";
import type { Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";

import { BooksService } from "./books.service";
import { CreateBookDto, UpdateBookDto } from "./dto/books.dto";
import { ApiResponseType } from "src/common/dto/responses.dto";
import { ResponseBookDTO } from "./dto/bookResponse.dto";
import { FAILED_CODE, SUCCESS_CODE } from "src/constants";
import { AuthGuard } from "src/common/guards/auth.guard";
import { ExtractUser } from "src/common/decorators/extractUser.decorator";

interface PaginatedResponseType<T> extends ApiResponseType<T> {
  meta: object;
  links: object;
}

@Controller("books")
@ApiTags("Books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({ summary: "Crear un Nuevo Libro" })
  @ApiResponse({
    status: 201,
    description: "Libro Creado",
    schema: {
      example: {
        message: "Mensaje de Creación Exitoso",
        code: "Código de Éxito",
        data: {
          id: "ID del Libro",
          title: "Título",
          author: "Autor",
          editorial: "Editorial",
          genre: "Género",
          price: "Precio",
          availability: "Disponibilidad",
          image_url: "URL de la imagen",
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "No Autorizado" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        author: { type: "string" },
        editorial: { type: "string" },
        price: { type: "number" },
        availability: { type: "boolean" },
        image: {
          type: "string",
          format: "binary",
        },
      },
      required: ["title", "author", "editorial", "price", "availability"],
    },
  })
  async create(
    @Body()
    createBookDto: CreateBookDto,
    @ExtractUser()
    userId: number,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ApiResponseType<ResponseBookDTO>> {
    let message: string;
    let code: string;
    let data: ResponseBookDTO | null = null;
    const imageBuffer = file?.buffer;
    const response = await this.booksService.create(
      createBookDto,
      userId,
      imageBuffer,
    );
    if (response) {
      message = "Book Created";
      code = SUCCESS_CODE;
      data = ResponseBookDTO.fromProjection(response);
    } else {
      message = "Book Was Not Created";
      code = FAILED_CODE;
    }
    return { message, code, data };
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Obtener Todos Los Libros Paginados" })
  @ApiResponse({
    status: 200,
    description: "Libros Obtenidos",
    schema: {
      example: {
        message: "Mensaje de Éxito",
        code: "Código de Éxito",
        data: [
          {
            id: "ID del Libro",
            title: "Título",
            author: "Autor",
            editorial: "Editorial",
            genre: "Género",
            price: "Precio",
            availability: "Disponibilidad",
            image_url: "URL de la imagen",
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: "No Autorizado" })
  async findAll(
    @Query("page")
    page: number = 1,
    @Query("limit")
    limit: number = 10,
  ): Promise<PaginatedResponseType<ResponseBookDTO[]>> {
    const { meta, links, data } = await this.booksService.findAllPaginated(
      page,
      limit,
    );
    return {
      message: "Books Obtained",
      code: SUCCESS_CODE,
      data: data.map((book) => ResponseBookDTO.fromProjection(book)),
      meta,
      links,
    };
  }

  @Get("/advanced")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Obtener Libros en base a filtros avanzados" })
  @ApiResponse({
    status: 200,
    description: "Libros Obtenidos",
    schema: {
      example: {
        message: "Mensaje de Éxito",
        code: "Código de Éxito",
        data: [
          {
            id: "ID del Libro",
            title: "Título",
            author: "Autor",
            editorial: "Editorial",
            genre: "Género",
            price: "Precio",
            availability: "Disponibilidad",
            image_url: "URL de la imagen",
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: "No Autorizado" })
  async advancedSearch(
    @Query() query: Record<string, string>,
  ): Promise<ApiResponseType<ResponseBookDTO[]>> {
    let message: string;
    let code: string;
    let data: ResponseBookDTO[] | null = null;
    console.log(`THE QUERY: ${JSON.stringify(query)}`);
    const books = await this.booksService.findAdvanced(query);
    if (books.length > 0) {
      data = books.map((book) => ResponseBookDTO.fromProjection(book));
      message = "Books Obtained Successfully";
      code = SUCCESS_CODE;
    } else {
      message = "No Books Obtained";
      code = FAILED_CODE;
    }
    return { message, code, data };
  }

  @Get("/export")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Obtener Todos los Libros como CSV" })
  @ApiResponse({ status: 200, description: "Archivo CSV Obtenido" })
  @ApiResponse({ status: 401, description: "No Autorizado" })
  async exporCSV(@Res() res: Response): Promise<any> {
    const csv = await this.booksService.exportToCSV();
    res.header("Content-Type", "text/csv");
    res.attachment(`csvExport-${new Date().getTime()}.csv`);
    return res.send(csv);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Obtener un Único Libro" })
  @ApiResponse({
    status: 200,
    description: "Libro Obtenido",
    schema: {
      example: {
        message: "Obtención Exitosa",
        code: "Código de Éxito",
        data: {
          id: "ID del Libro",
          title: "Título",
          author: "Autor",
          editorial: "Editorial",
          genre: "Género",
          price: "Precio",
          availability: "Disponibilidad",
          image_url: "URL de la imagen",
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "No Autorizado" })
  async findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ApiResponseType<ResponseBookDTO | null>> {
    let message: string;
    let code: string;
    let data: ResponseBookDTO | null = null;
    const response = await this.booksService.findOne(id);
    if (response) {
      message = "Book Obtained";
      code = SUCCESS_CODE;
      data = ResponseBookDTO.fromProjection(response);
    } else {
      message = "Book Not Found";
      code = FAILED_CODE;
    }
    return { message, code, data };
  }

  @Put(":id")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({ summary: "Editar un Libro" })
  @ApiResponse({
    status: 200,
    description: "Libro Editado",
    schema: {
      example: {
        message: "Edición Exitosa",
        code: "Código de Éxito",
        data: {
          id: "ID del Libro",
          title: "Título",
          author: "Autor",
          editorial: "Editorial",
          genre: "Género",
          price: "Precio",
          availability: "Disponibilidad",
          image_url: "URL de la imagen",
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "No Autorizado" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        author: { type: "string" },
        editorial: { type: "string" },
        price: { type: "number" },
        availability: { type: "boolean" },
        image: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async update(
    @Param("id", ParseIntPipe)
    id: number,
    @Body()
    updateBookDto: UpdateBookDto,
    @ExtractUser()
    userId: number,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ApiResponseType<ResponseBookDTO>> {
    let message: string;
    let code: string;
    let data: ResponseBookDTO | null = null;
    const imageBuffer = file?.buffer;
    const response = await this.booksService.update(
      id,
      updateBookDto,
      userId,
      imageBuffer,
    );
    if (response) {
      message = "Book Updated";
      code = SUCCESS_CODE;
      data = ResponseBookDTO.fromProjection(response);
    } else {
      message = "Book Was Not Updated";
      code = FAILED_CODE;
    }
    return { message, code, data };
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiOperation({ summary: "Eliminar Libro" })
  @ApiResponse({ status: 204, description: "Libro Eliminado" })
  @ApiResponse({ status: 401, description: "No Autorizado" })
  async remove(
    @Param("id", ParseIntPipe)
    id: number,
    @ExtractUser()
    userId: number,
  ): Promise<void> {
    return await this.booksService.remove(id, userId);
  }
}
