import { type DB } from '../index.js';

function createTicketsHandler(db: DB) {
    const getTickets = async () => {
        return db.query.ticketsTable.findMany();
    };

    return {
        getTickets,
    };
}

export { createTicketsHandler };
