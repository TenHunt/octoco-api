import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  author: z.string().min(1, 'Author is required').max(100, 'Author name too long'),
  price: z.number().positive('Price must be positive').max(10000, 'Price too high'),
  isbn: z
    .string()
    .regex(
      /^(?:\d{10}|\d{3}-\d{1,5}-\d{1,7}-\d{1}|\d{13})$/,
      'Invalid ISBN format (ISBN-10 or ISBN-13)'
    ),
  genre: z.string().optional(),
});

export const updateBookSchema = createBookSchema.partial();