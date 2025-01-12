import express from 'express';
import booksRouter from '@routes/books';
import categoriesRouter from '@routes/categories/categories';

const router = express.Router();

router.use('/books', booksRouter);
router.use('/categories', categoriesRouter);

export default router;
