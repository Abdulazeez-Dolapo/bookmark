import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import createError from 'http-errors';

import appRoutes from '@routes/index';
import { ErrorType } from './types';

dotenv.config();

const app: Express = express();
const port = normalizePort(process.env.PORT || '3000');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('', appRoutes);

app.use(function (req, res, next) {
	next(createError(404));
});
app.use(function (err: ErrorType, req: Request, res: Response) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500).send({ err });
});

function normalizePort(val: string) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

app.listen(port, () => {
	console.log(`[server]: Server is running at ${port}`);
});
