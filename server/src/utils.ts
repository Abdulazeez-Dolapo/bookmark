import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Prisma } from '@prisma/client';

export const validationHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const result = validationResult(req);

	if (result.isEmpty()) {
		return next();
	}

	res.status(400).send({ error: result.array() });
};

const prismaErrorHandler = (error: unknown) => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		switch (error.code) {
			case 'P2002': // Unique constraint violation
				return {
					statusCode: 409,
					message: `Duplicate entry for fields: ${(
						error.meta?.target as string[]
					).join(', ')}`,
				};
			case 'P2025': // Record not found
				return {
					statusCode: 404,
					message: 'Record not found.',
				};

			default:
				return {
					statusCode: 500,
					message: `An unknown Prisma error occurred: ${error.code}:${error.message}`,
				};
		}
	}

	return {
		statusCode: 500,
		message: 'An unexpected error occurred.',
	};
};

export const globalErrorHandler = (
	error: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		const handledError = prismaErrorHandler(error);
		res.status(handledError.statusCode).json({ error: handledError.message });
	} else {
		res.status(500).json({ error: `An unexpected error occurred: ${error}` });
	}

	next();
};
