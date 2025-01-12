import express, { Express } from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';

import appRoutes from '@routes/index';
import { globalErrorHandler } from './utils';

dotenv.config();

const app: Express = express();
const port = normalizePort(process.env.PORT || '3000');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', appRoutes);

app.use(globalErrorHandler);

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
