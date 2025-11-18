// src/routes/book.routes.ts
// import { Router, type RequestHandler } from 'express';
// import { BookController } from '../controllers/book.controller.js';
// import { BookService } from '../services/book.service.js';
// import { BookRepository } from '../repositories/book.repository.js';

// const router = Router();

// const repo = new BookRepository();
// const service = new BookService(repo);
// const controller = new BookController(service);

// const validateCreate: RequestHandler = controller.create[0] as RequestHandler;
// const handleCreate: RequestHandler = controller.create[1] as RequestHandler;

// const validateUpdate: RequestHandler = controller.update[0] as RequestHandler;
// const handleUpdate: RequestHandler = controller.update[1] as RequestHandler;

// const validateDiscountPrice: RequestHandler = controller.getDiscountedPrice[0] as RequestHandler;
// const handleDiscountPrice: RequestHandler = controller.getDiscountedPrice[1] as RequestHandler;

// router.post('/', validateCreate, handleCreate);
// router.get('/', controller.getAll);
// router.get('/:id', controller.getById);
// router.put('/:id', validateUpdate, handleUpdate);
// router.delete('/:id', controller.delete);
// router.get('/discounted-price', ...controller.getDiscountedPrice!);

// export default router;

// src/routes/book.routes.ts

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