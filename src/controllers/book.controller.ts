// controllers/book.controller.ts — SIMPLIFIED & WORKING
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import { BookService } from '../services/book.service.js';
import { ValidationError } from '../errors/ValidationError.js';
import { z } from 'zod';
//import { CreateBookDto, UpdateBookDto, DiscountPriceQuery } from '../dtos'; // your DTOs
import type { CreateBookDto } from '../dtos/createbook.dto.js';
import type { UpdateBookDto } from '../dtos/updatebook.dto.js';
import type { DiscountPriceQueryDto } from '../dtos/discount-price.dto.js';


// Zod schemas (keep as-is)
const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  author: z.string().min(1, 'Author is required').max(100),
  price: z.number().positive('Price must be positive').max(10000),
  isbn: z.string().regex(/^(?:\d{10}|\d{3}-\d{1,5}-\d{1,7}-\d{1}|\d{13})$/, 'Invalid ISBN'),
  genre: z.string().min(1, 'Genre is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

const updateBookSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  author: z.string().min(1).max(100).optional(),
  price: z.number().positive().max(10000).optional(),
  isbn: z.string().regex(/^(?:\d{10}|\d{3}-\d{1,5}-\d{1,7}-\d{1}|\d{13})$/).optional(),
  genre: z.string().min(1).optional(),
  quantity: z.number().int().min(1).optional(),
}).strict();

const discountPriceQuerySchema = z.object({
  genre: z.string().min(1, 'Genre is required'),
  discount: z.coerce.number().min(0).max(100, 'Discount must be between 0 and 100%'),
});

export class BookController {
  constructor(private service: BookService) {}

  // CREATE — SIMPLE TUPLE, NO CAST
  create: RequestHandler[] = [
    (req, _res, next) => {
      const result = createBookSchema.safeParse(req.body);
      if (!result.success) {
        return next(new ValidationError(result.error.flatten().fieldErrors));
      }
      (req as any).validatedBody = result.data;
      next();
    },
    async (req, res) => {
      const book = await this.service.create((req as any).validatedBody);
      res.status(201).json(book);
    },
  ];

  // UPDATE — SIMPLE TUPLE, NO CAST
  update: RequestHandler[] = [
    (req, _res, next) => {
      const result = updateBookSchema.safeParse(req.body);
      if (!result.success) {
        return next(new ValidationError(result.error.flatten().fieldErrors));
      }
      (req as any).validatedBody = result.data;
      next();
    },
    async (req, res) => {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError({ id: ['Book ID is required'] });
      }
      const book = await this.service.update(id, (req as any).validatedBody);
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.json(book);
    },
  ];

  // READ ALL
  getAll: RequestHandler = (_req, res) => {
    res.json(this.service.getAll());
  };

  // READ ONE
  getById: RequestHandler = (req, res) => {
    const { id } = req.params;
    if (!id) {
      throw new ValidationError({ id: ['Book ID is required'] });
    }
    const book = this.service.getById(id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  };

  // GET BOOKS BY GENRE → /api/books/genre/Fiction
  getByGenre: RequestHandler = (req, res) => {
    const { genre } = req.params;

    if (!genre) {
      return res.status(400).json({ error: 'Genre is required' });
    }

    const books = this.service.getAll();
    const filtered = books.filter(
      book => book.genre?.toLowerCase() === genre.toLowerCase()
    );

    res.json(filtered);
  };

  // DELETE
  delete: RequestHandler = (req, res) => {
    const { id } = req.params;
    if (!id) {
      throw new ValidationError({ id: ['Book ID is required'] });
    }
    const deleted = this.service.delete(id);
    res.status(deleted ? 204 : 404).end();
  };

  getDiscountedPrice: RequestHandler[] = [
    (req, _res, next) => {
      const result = discountPriceQuerySchema.safeParse(req.query);
      if (!result.success) {
        return next(new ValidationError(result.error.flatten().fieldErrors));
      }
      // Just attach the validated data somewhere safe
      (req as any).validatedQuery = result.data;
      next();
    },
    (req, res) => {
      const { genre, discount } = (req as any).validatedQuery as DiscountPriceQueryDto;
      const total = this.service.calculateDiscountedPrice(genre, discount);
      res.json({
        genre,
        discount_percentage: discount,
        total_discounted_price: Number(total.toFixed(2)),
      });
    },
  ];
}