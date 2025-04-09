import type { ObjectId } from "mongodb";
import { getDb } from "./connection.js";

type TUser = {
    _id: ObjectId;
    username: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'ORGANISER' | 'GUEST';
};

const db = await getDb();
const usersCollection = db.collection('users');

async function getUsers(): Promise<TUser[]> {
    const users = (await usersCollection.find({}).toArray()) as unknown as TUser[];
    
    return users;
}

async function findUser(username: string) {
    return usersCollection.find({ username }).toArray();
}

async function createUser(newUser: Omit<TUser, '_id'>): Promise<TUser> {
    const userCreated = await usersCollection.insertOne(newUser);

    return { _id: userCreated.insertedId, ...newUser };
}


export {
    getUsers,
    findUser,
    createUser
};