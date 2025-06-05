import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a book', () => {
    const dto = { title: 'Test', author: 'Author', editorial: 'Editorial', price: 10, availability: true, genre: 'Genre' };
    expect(service.create(dto as any)).toBe('This action adds a new book');
  });

  it('should return all books', () => {
    expect(service.findAll()).toBe('This action returns all books');
  });

  it('should return a book by id', () => {
    expect(service.findOne(1)).toBe('This action returns a #1 book');
  });

  it('should update a book', () => {
    const dto = { title: 'Updated' };
    expect(service.update(1, dto as any)).toBe('This action updates a #1 book');
  });

  it('should remove a book', () => {
    expect(service.remove(1)).toBe('This action removes a #1 book');
  });
});