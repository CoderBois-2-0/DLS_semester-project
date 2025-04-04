import { getDB } from '../index.js';

const db = await getDB();

async function getTickets() {
    return db.query.ticketsTable.findMany();
}

export { getTickets };
