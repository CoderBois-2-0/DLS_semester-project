import { type DB } from '../index.js';

function createEventsHandler(db: DB) {
    const getEvents = async () => {
        return db.query.eventsTable.findMany();
    }

    return {
        getEvents
    }
}

export { createEventsHandler };
