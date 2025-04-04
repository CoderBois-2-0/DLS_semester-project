import { getDB } from '../index.js';

const db = await getDB();

async function getEvents() {
    return db.query.postsTable.findMany();
}

export { getEvents };
