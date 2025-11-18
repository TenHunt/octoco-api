// src/server.ts
import express, { type Request, type Response, type NextFunction } from 'express';
import bookRoutes from './routes/book.routes.js';
import { ValidationError } from './errors/ValidationError.js';

const app = express();

app.use(express.json());
app.use('/api/books', bookRoutes);

// Health check
app.get('/', (_req, res) => {
  res.send('Bookstore API running');
});

// Global Error Handler (MUST BE LAST)
app.use((error: any, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ValidationError) {
    // Safe handling even if error.errors is undefined or not an object
    const fieldErrors = error.errors ?? {};
    const details = Object.entries(fieldErrors).map(([field, messages]) => ({
      field,
      message: Array.isArray(messages) ? messages[0] : messages,
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details,
    });
  }

  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message || 'Something went wrong',
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Bookstore API running on http://localhost:${PORT}`);
  console.log(`→ Open: http://localhost:${PORT}/api/books`);
});