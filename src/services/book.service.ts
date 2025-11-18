// src/services/book.service.ts
import type { Book } from '../models/book.model.js';
import { BookRepository } from '../repositories/book.repository.js';
import type { CreateBookDto } from '../dtos/createbook.dto.js';
import type { UpdateBookDto } from '../dtos/updatebook.dto.js';

export class BookService {
  constructor(private repo: BookRepository) {}

  getAll(): Book[] {
    return this.repo.findAll();
  }

  getById(id: string): Book | null | undefined {
    return this.repo.findById(id);
  }

  create(dto: CreateBookDto): Book {
    const book: Book = { id: Date.now().toString(), ...dto };
    return this.repo.create(book);
  }

  update(id: string, dto: UpdateBookDto): Book | null {
    return this.repo.update(id, dto);
  }

  delete(id: string): boolean {
    return this.repo.delete(id);
  }

  // Only this method cares about discounts — and only when explicitly asked
  calculateDiscountedPrice(genre: string, discountPercent: number): number {
    const books = this.repo.findAll();
    const matching = books.filter(b => b.genre?.toLowerCase() === genre.toLowerCase());

    if (matching.length === 0 || discountPercent <= 0) return 0;

    const total = matching.reduce((sum, b) => sum + (b.price || 0), 0);
    return Number((total * (1 - discountPercent / 100)).toFixed(2));
  }
}