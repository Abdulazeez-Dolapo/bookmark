import express, { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

import prismaClient from 'prisma/prismaClient';
import { validationHandler } from 'src/utils';
import { CreateCategoryBody } from 'src/types';

import { createCategory as createCategoryValidator } from './validators';

const router = express.Router();

router.get('/', async function (req, res) {
	const categories = await prismaClient.category.findMany({
		orderBy: { createdAt: 'desc' },
	});
	res.status(200).json({ data: categories });
});

router.post(
	'/',
	createCategoryValidator(['body']),
	validationHandler,
	async function (req: Request, res: Response, next: NextFunction) {
		try {
			const { name } = matchedData<CreateCategoryBody>(req);
			const id = uuidv4();

			await prismaClient.category.create({ data: { name, id } });

			const categories = await prismaClient.category.findMany({
				include: {
					books: true,
					_count: true,
				},
			});

			res.status(201).json({ data: categories });
		} catch (error) {
			next(error);
		}
	}
);

export default router;
