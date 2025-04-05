import { defineConfig } from 'drizzle-kit';

if (!process.env.DB_URL) {
    throw new Error(
        'Database URL is not set. Please set the DB_URL environment variable.'
    );
}
const DB_URL = process.env.DB_URL;
export default defineConfig({
    dialect: 'postgresql',
    schema: './lib/schemas/*Schema.ts',
    out: './drizzle',
    dbCredentials: {
        url: DB_URL,
    },
});
