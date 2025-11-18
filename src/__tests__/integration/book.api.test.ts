// src/__tests__/integration/book.api.test.ts
import request from 'supertest';
import express from 'express';
import { BookController } from '../../controllers/book.controller.js';
import { BookService } from '../../services/book.service.js';
import { BookRepository } from '../../repositories/book.repository.js';

// In-memory instances for testing
const repo = new BookRepository();
const service = new BookService(repo);
const controller = new BookController(service);

const app = express();
app.use(express.json());

// Register routes correctly (using ! to assert non-null)
app.post('/api/books', controller.create[0]!, controller.create[1]!);
app.get('/api/books', controller.getAll);
app.get('/api/books/discounted-price', controller.getDiscountedPrice[0]!, controller.getDiscountedPrice[1]!);
app.get('/api/books/genre/:genre', controller.getByGenre);
app.get('/api/books/:id', controller.getById);
app.put('/api/books/:id', controller.update[0]!, controller.update[1]!);
app.delete('/api/books/:id', controller.delete);

describe('Bookstore API - Integration', () => {
  let bookId: string;

  // Clear the in-memory repo before each test
  beforeEach(() => {
    // Direct access to private property — only okay in tests
    (repo as any).books = [];
  });

  it('POST /api/books - creates book', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        genre: 'Fiction',
        price: 55,
        quantity: 10,
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('1984');
    expect(res.body.author).toBe('George Orwell');
    expect(res.body.price).toBe(55);
    expect(res.body.quantity).toBe(10);
    expect(res.body.id).toBeDefined();

    bookId = res.body.id;
  });

  it('POST /api/books - creates book with quantity', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({
        title: 'Dune',
        author: 'Frank Herbert',
        isbn: '9780441013593',
        genre: 'Fiction',
        price: 79.99,
        quantity: 5,
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Dune');
    expect(res.body.quantity).toBe(5);
    expect(res.body.id).toBeDefined();
  });

  it('GET /api/books - returns list of books', async () => {
    await request(app).post('/api/books').send({
      title: 'Test Book',
      author: 'Test Author',
      isbn: '1234567890',
      genre: 'Fiction',
      price: 99,
      quantity: 1,
    });

    const res = await request(app).get('/api/books');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    // No discount field anymore → test real fields instead
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('title');
    expect(res.body[0]).toHaveProperty('price');
  });

  it('GET /api/books/discounted-price - applies flat discount correctly', async () => {
    // Add two fiction books
    await request(app).post('/api/books').send({
      title: 'Book 1',
      author: 'A',
      isbn: '1111111111',
      genre: 'Fiction',
      price: 50,
      quantity: 1,
    });
    await request(app).post('/api/books').send({
      title: 'Book 2',
      author: 'B',
      isbn: '2222222222',
      genre: 'Fiction',
      price: 30,
      quantity: 1,
    });

    const res = await request(app)
      .get('/api/books/discounted-price')
      .query({ genre: 'Fiction', discount: 20 });

    expect(res.status).toBe(200);
    expect(res.body.genre).toBe('Fiction');
    expect(res.body.discount_percentage).toBe(20);
    // 80 total → 20% off = 64
    expect(res.body.total_discounted_price).toBe(64);
  });

  it('PUT /api/books/:id - updates book fields', async () => {
    const createRes = await request(app)
      .post('/api/books')
      .send({
        title: 'To Update',
        author: 'Old',
        isbn: '9999999999',
        genre: 'Non-Fiction',
        price: 100,
        quantity: 3,
      });

    bookId = createRes.body.id;

    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .send({ quantity: 15, price: 89.99 });

    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(15);
    expect(res.body.price).toBe(89.99);
  });

  it('DELETE /api/books/:id - removes book', async () => {
    const createRes = await request(app)
      .post('/api/books')
      .send({
        title: 'Delete Me',
        author: 'Temp',
        isbn: '8888888888',
        genre: 'Fiction',
        price: 10,
        quantity: 1,
      });

    const idToDelete = createRes.body.id;

    const deleteRes = await request(app).delete(`/api/books/${idToDelete}`);
    expect(deleteRes.status).toBe(204);

    const check = await request(app).get(`/api/books/${idToDelete}`);
    expect(check.status).toBe(404);
  });
});