import { type DB } from '../index.js';

function createCommentsHandler(db: DB) {
    const getComments = async () => {
        return db.query.eventsTable.findMany();
    };

    return {
        getComments,
    };
}

export { createCommentsHandler };
