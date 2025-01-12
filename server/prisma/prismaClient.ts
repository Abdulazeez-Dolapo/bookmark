import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

process.on('SIGINT', async () => {
	console.log('Disconnecting Prisma due to app termination (SIGINT)...');
	await prisma.$disconnect();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.log('Disconnecting Prisma due to app termination (SIGTERM)...');
	await prisma.$disconnect();
	process.exit(0);
});

process.on('uncaughtException', async error => {
	console.error('Uncaught Exception:', error);
	await prisma.$disconnect();
	process.exit(1);
});

export default prisma;
