import { Router } from 'express';
import { BookController } from '../controllers/book.controller.js';
import { BookService } from '../services/book.service.js';
import { BookRepository } from '../repositories/book.repository.js';

const router = Router();

const repo = new BookRepository();
const service = new BookService(repo);
const controller = new BookController(service);

router.post('/', ...controller.create!);
router.get('/', controller.getAll);
router.get('/discounted-price', ...controller.getDiscountedPrice!);
router.get('/genre/:genre', controller.getByGenre);
router.get('/:id', controller.getById);
router.put('/:id', ...controller.update!);
router.delete('/:id', controller.delete);

export default router;