import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto/books.dto';
import { ApiResponseType } from 'src/common/dto/responses.dto';
import { ResponseBookDTO } from './dto/bookResponse.dto';
import { FAILED_CODE, SUCCESS_CODE } from 'src/constants';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<ApiResponseType<ResponseBookDTO>> {
    let message;
    let code;
    let data;
    const response = await this.booksService.create(createBookDto);
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
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
