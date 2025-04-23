import type { ObjectId } from 'mongodb';
import { getDb } from './connection.js';
import argon2 from 'argon2';

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
    const users = (await usersCollection
        .find({})
        .toArray()) as unknown as TUser[];

    return users;
}

async function findUser(username: string) {
    return usersCollection.find({ username }).toArray();
}

async function createUser(newUser: Omit<TUser, '_id'>): Promise<Omit<TUser, 'password'>> {
    const hashedPassword = await argon2.hash(newUser.password);
    const user: Omit<TUser, '_id'> = { ...newUser, password: hashedPassword };

    const userCreated = await usersCollection.insertOne({ ...user });

    return { _id: userCreated.insertedId, ...user };
}

export { getUsers, findUser, createUser };
