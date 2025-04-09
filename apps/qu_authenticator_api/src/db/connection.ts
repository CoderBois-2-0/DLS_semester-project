import { Db, MongoClient } from 'mongodb'

let db: null | Db = null;

async function connect() {
    const url = process.env.DB_URL ?? 'No DB URL';
    const client = new MongoClient(url);

    await client.connect();

    return client.db('queue-up');
}

async function getDb() {
    if (!db) {
        db = await connect();
    }

    return db;
}


export {
    getDb
};