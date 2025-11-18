import { BookService } from '../../services/book.service.js';
import { BookRepository } from '../../repositories/book.repository.js';

describe('BookService', () => {
  let service: BookService;

  beforeEach(() => {
    const repo = new BookRepository();
    service = new BookService(repo);
  });

  it('creates a book successfully', () => {
    const book = service.create({
      title: 'Test Book',
      author: 'Test Author',
      isbn: '978-1234567890',
      genre: 'Fiction',
      price: 99.99,
      quantity: 5,
    });

    expect(book.title).toBe('Test Book');
    expect(book.price).toBe(99.99);
    expect(book.quantity).toBe(5);
    expect(book.id).toBeDefined();
    expect(book).not.toHaveProperty('discount');
  });

  it('calculates discounted price correctly', () => {
    service.create({ title: 'A', author: 'A', isbn: '1', genre: 'Fiction', price: 100, quantity: 1 });
    service.create({ title: 'B', author: 'B', isbn: '2', genre: 'Fiction', price: 50, quantity: 1 });

    const total = service.calculateDiscountedPrice('Fiction', 25);
    expect(total).toBe(112.5); // 150 * 0.75 = 112.5
  });
});