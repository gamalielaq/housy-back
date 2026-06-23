import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'test', 'production')
        .default('development'),
    PORT: Joi.number().port().default(3000),
    FRONTEND_URL: Joi.string().uri().default('http://localhost:4200'),
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().port().default(3306),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().allow('').default(''),
    DB_DATABASE: Joi.string().required(),
    DB_LOGGING: Joi.boolean().default(false),
});
