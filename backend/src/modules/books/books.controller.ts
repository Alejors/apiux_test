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
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

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
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Create a New Book" })
  @ApiResponse({ status: 201, description: "Book Created"})
  @ApiResponse({ status: 401, description: "Not Logged In -Unauthorized-" })
  async create(
    @Body() 
    createBookDto: CreateBookDto,
    @ExtractUser()
    userId: number,
  ): Promise<ApiResponseType<ResponseBookDTO>> {
    let message;
    let code;
    let data;
    const response = await this.booksService.create(createBookDto, userId);
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
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) 
    id: number, 
    @Body() 
    updateBookDto: UpdateBookDto,
    @ExtractUser()
    userId: number,
  ) {
    return this.booksService.update(id, updateBookDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(
    @Param('id', ParseIntPipe)
    id: number,
    @ExtractUser()
    userId: number,
  ) {
    return this.booksService.remove(id, userId);
  }
}
