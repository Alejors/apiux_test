import {
  Controller,
  Get,
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
} from '@nestjs/common';
import type { Multer } from 'multer';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto/books.dto';
import { ApiResponseType } from 'src/common/dto/responses.dto';
import { ResponseBookDTO } from './dto/bookResponse.dto';
import { FAILED_CODE, SUCCESS_CODE } from 'src/constants';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ExtractUser } from 'src/common/decorators/extractUser.decorator';

@Controller('books')
@ApiTags('Books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: "Create a New Book" })
  @ApiResponse({ status: 201, description: "Book Created" })
  @ApiResponse({ status: 401, description: "Not Logged In -Unauthorized-" })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        editorial: { type: 'string' },
        price: { type: 'number' },
        availability: { type: 'boolean' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['title', 'author', 'editorial', 'price', 'availability'],
    },
  })
  async create(
    @Body()
    createBookDto: CreateBookDto,
    @ExtractUser()
    userId: number,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ApiResponseType<ResponseBookDTO>> {
    let message;
    let code;
    let data;
    const imageBuffer = file?.buffer;
    const response = await this.booksService.create(createBookDto, userId, imageBuffer);
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
  @ApiOperation({ summary: "Get All Books" })
  @ApiResponse({ status: 200, description: "Books Collected" })
  @ApiResponse({ status: 401, description: "Not Logged In -Unauthorized-" })
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Get Single Book" })
  @ApiResponse({ status: 200, description: "Book Collected" })
  @ApiResponse({ status: 401, description: "Not Logged In -Unauthorized-" })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: "Edit Book" })
  @ApiResponse({ status: 200, description: "Book Updated" })
  @ApiResponse({ status: 401, description: "Not Logged In -Unauthorized-" })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        editorial: { type: 'string' },
        price: { type: 'number' },
        availability: { type: 'boolean' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    updateBookDto: UpdateBookDto,
    @ExtractUser()
    userId: number,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ApiResponseType<ResponseBookDTO>> {
    let message;
    let code;
    let data;
    const imageBuffer = file?.buffer;
    const response = await this.booksService.update(id, updateBookDto, userId, imageBuffer);
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

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiOperation({ summary: "Delete Book" })
  @ApiResponse({ status: 204, description: "Book Deleted" })
  @ApiResponse({ status: 401, description: "Not Logged In -Unauthorized-" })
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
    @ExtractUser()
    userId: number,
  ): Promise<void> {
    return await this.booksService.remove(id, userId);
  }
}
