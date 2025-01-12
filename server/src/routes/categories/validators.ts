import { checkSchema, Location } from 'express-validator';

export const createCategory = (locations: Location[]) => {
	return checkSchema(
		{
			name: {
				trim: true,
				isLength: {
					options: { min: 3 },
					errorMessage: 'name must be at least 3 characters long',
				},
			},
		},
		locations
	);
};
