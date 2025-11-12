import type { Book } from '../models/book.model.js';

export class BookRepository {
  private books: Book[] = [];

  // Retrieve all books
  findAll(): Book[] {
    return this.books;
  }

  // Retrieve details of a book by its ID
  findById(id: string): Book | undefined {
    return this.books.find(b => b.id === id);
  }

  // Add a new book to the inventory
  create(book: Book): Book {
    this.books.push(book);
    return book;
  }

  // Update details of an existing book
  update(id: string, data: Partial<Book>): Book | null {
    const book = this.findById(id);
    if (!book) return null;
    return Object.assign(book, data);
  }

  // Delete a book from the inventory
  delete(id: string): boolean {
    const idx = this.books.findIndex(b => b.id === id);
    if (idx === -1) return false;
    this.books.splice(idx, 1);
    return true;
  }
}