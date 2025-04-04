import { getDB } from '../index.js';

const db = await getDB();

async function getEvents() {
    return db.query.eventsTable.findMany();
}

export { getEvents };
