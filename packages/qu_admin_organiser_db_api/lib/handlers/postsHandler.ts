import { type DB } from '../index.js';

function createPostsHandler(db: DB) {
    const getEvents = async () => {
        return db.query.postsTable.findMany();
    };

    return {
        getEvents
    };
}

export { createPostsHandler };
