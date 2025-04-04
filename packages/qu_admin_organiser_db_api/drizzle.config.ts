import { defineConfig } from 'drizzle-kit';

const DB_URL = process.env.DB_URL ?? 'No Database Url';

export default defineConfig({
    dialect: 'postgresql',
    schema: './lib/schemas/*Schema.ts',
    out: './drizzle',
    dbCredentials: {
        url: DB_URL,
    },
});
