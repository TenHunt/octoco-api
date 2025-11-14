import type { Request, Response } from 'express';
import { BookService } from '../services/book.service.js';
import type { CreateBookDto } from '../dtos/createbook.dto.js';
import type { UpdateBookDto } from '../dtos/updatebook.dto.js';

export class BookController {
    constructor(private service: BookService) {}

    getAll = (_req: Request, res: Response) => {
        const books = this.service.getAll();
        res.json(books);
    };

    getById = (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'Book ID is required' });
        }

        const book = this.service.getById(id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(book);
    };

    create = (req: Request, res: Response) => {
        const dto: CreateBookDto = req.body;
        const book = this.service.create(dto);
        res.status(201).json(book);
    };

    update = (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'Book ID is required' });
        }

        const dto: UpdateBookDto = req.body;
        const book = this.service.update(id, dto);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(book);
    };

    delete = (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'Book ID is required' });
        }

        const deleted = this.service.delete(id);
        res.status(deleted ? 204 : 404).send();
    };
}