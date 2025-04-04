import { drizzle } from 'drizzle-orm/neon-http';
import {
    eventsSchema,
    ticketsSchema,
    postsSchema,
    commentsSchema,
} from './schemas/index.js';
import { createEventsHandler } from './handlers/eventsHandler.js';
import { createTicketsHandler } from './handlers/ticketsHandler.js';
import { createPostsHandler } from './handlers/postsHandler.js';
import { createCommentsHandler } from './handlers/commentsHandler.js';

type DB = ReturnType<typeof connect>;
function connect(dbUrl: string) {
    return drizzle(dbUrl, {
        schema: {
            ...eventsSchema,
            ...ticketsSchema,
            ...postsSchema,
            ...commentsSchema,
        },
    });
}

function getHandlers(dbUrl: string) {
    const db = connect(dbUrl);

    const eventsHandler = createEventsHandler(db);
    const ticketsHandler = createTicketsHandler(db);
    const postsHandler = createPostsHandler(db);
    const commentsHandler = createCommentsHandler(db);

    return {
        eventsHandler,
        ticketsHandler,
        postsHandler,
        commentsHandler,
    };
}

export { getHandlers, type DB };
