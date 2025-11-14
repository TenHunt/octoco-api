import type { Book } from '../models/book.model.js';
import { BookRepository } from '../repositories/book.repository.js';
import type { CreateBookDto } from '../dtos/createbook.dto.js';
import type { UpdateBookDto } from '../dtos/updatebook.dto.js';

export class BookService {
  constructor(private repo: BookRepository) {}

    // Retrieve all books
    getAll(): Book[] {
        return this.repo.findAll().map(b => this.applyDiscount(b));
    }

    // Retrieve details of a book by its ID
    getById(id: string): Book | null {
        const book = this.repo.findById(id);
        return book ? this.applyDiscount(book) : null;
    }

    // Add a new book to the inventory
    create(dto: CreateBookDto): Book {
        const book: Book = {
            id: Date.now().toString(),
            ...dto
        };
        return this.applyDiscount(this.repo.create(book));
    }

    // Update details of an existing book
    update(id: string, dto: UpdateBookDto): Book | null {
        const updated = this.repo.update(id, dto);
        return updated ? this.applyDiscount(updated) : null;
    }

    // Delete a book from the inventory
    delete(id: string): boolean {
        return this.repo.delete(id);
    }

    // Apply a discount to a book
    private applyDiscount(book: Book): Book {
        // DISCOUNT HERE

        return book;
    }
}