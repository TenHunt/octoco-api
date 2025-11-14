import express from 'express';
import bookRoutes from './routes/book.routes.js';

const app = express();

app.use(express.json());
app.use('/api/books', bookRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Bookstore API listening on port ${PORT}`);
});