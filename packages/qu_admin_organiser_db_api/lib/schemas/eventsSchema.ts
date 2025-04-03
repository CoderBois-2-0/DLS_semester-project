import { relations } from "drizzle-orm";
import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { ticketsSchema } from "./index";

const eventsTable = pgTable('events', {
    id: varchar('id', { length: 128 }).primaryKey(),
    name: varchar('name', { length: 10 }).notNull(),
    userId: varchar('user_id', { length: 128 }).notNull(),
    userEmail: varchar('user_email', { length: 50 }).notNull(),
    userUsername: varchar('user_username', { length: 10 }).notNull(),
    location: varchar('location', { length: 50 }),
    createdAt: timestamp('created_at').notNull()
});

const eventsRelation = relations(eventsTable, ({ many }) => {
    return {
        tickets: many(ticketsSchema.ticketsTable)
    }
});

export {
    eventsTable,
    eventsRelation
};