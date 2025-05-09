import { relations } from 'drizzle-orm';
import { pgTable, varchar, real, timestamp } from 'drizzle-orm/pg-core';
import { ticketsSchema } from './index';

const eventsTable = pgTable('events', {
    id: varchar('id', { length: 128 }).primaryKey(),
    userId: varchar('user_id', { length: 128 }).notNull(),
    createdAt: timestamp('created_at').notNull(),
});

const eventsRelation = relations(eventsTable, ({ many }) => {
    return {
        tickets: many(ticketsSchema.ticketsTable),
        snapshots: many(eventSnapshotsTable),
        tombstones: many(eventTombstonesTable),
    };
});

const eventSnapshotsTable = pgTable('event_snapshots', {
    id: varchar('id', { length: 128 }).primaryKey(),
    name: varchar('name', { length: 10 }).notNull(),
    price: real('price').notNull(),
    userEmail: varchar('user_email', { length: 50 }).notNull(),
    userUsername: varchar('user_username', { length: 10 }).notNull(),
    location: varchar('location', { length: 50 }),
    updatedAt: timestamp('updated_at').notNull(),
    eventsId: varchar('event_id', { length: 128 }).notNull(),
});

const eventSnapshotsRelation = relations(eventSnapshotsTable, ({ one }) => {
    return {
        event: one(eventsTable, {
            fields: [eventSnapshotsTable.eventsId],
            references: [eventsTable.id],
        }),
    };
});

const eventTombstonesTable = pgTable('event_tombstones', {
    id: varchar('id', { length: 128 }).primaryKey(),
    eventsId: varchar('event_id', { length: 128 }).notNull(),
    deletedAt: timestamp('deleted_at').notNull(),
});

const eventsTombstonesRelation = relations(eventTombstonesTable, ({ one }) => {
    return {
        event: one(eventsTable, {
            fields: [eventTombstonesTable.eventsId],
            references: [eventsTable.id],
        }),
    };
});

export {
    eventsTable,
    eventsRelation,
    eventSnapshotsTable,
    eventSnapshotsRelation,
    eventTombstonesTable,
    eventsTombstonesRelation,
};
