import { drizzle } from 'drizzle-orm/neon-http';
import { eventsSchema, ticketsSchema, postsSchema, commentsSchema } from './schemas/index.js';

const DB_URL = process.env.DB_URL ?? 'No Database Url';

async function connect() {
    return drizzle(DB_URL, { schema: { ...eventsSchema, ...ticketsSchema, ...postsSchema, ...commentsSchema }})
}

function getDB() {
    if (!db) {
        db = connect();
    }

    return db;
}

let db: null | ReturnType<typeof connect> = null;

export {
    getDB
};