import { drizzle } from 'drizzle-orm/neon-http';
import {
    eventsSchema,
    ticketsSchema,
    postsSchema,
    commentsSchema,
} from './schemas/index.js';

async function connect(dbUrl: string) {
    return drizzle(dbUrl, {
        schema: {
            ...eventsSchema,
            ...ticketsSchema,
            ...postsSchema,
            ...commentsSchema,
        },
    });
}

function getDB(dbUrl: string) {
    if (!db) {
        db = connect(dbUrl);
    }

    return db;
}

let db: null | ReturnType<typeof connect> = null;

export { getDB };
