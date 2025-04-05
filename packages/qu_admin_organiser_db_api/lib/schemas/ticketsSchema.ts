import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { eventsSchema } from './index';

const ticketsTable = pgTable('tickets', {
    id: varchar('id', { length: 128 }).primaryKey(),
    eventId: varchar('event_id', { length: 128 }).notNull(),
    userId: varchar('user_id', { length: 128 }).notNull(),
    createdAt: timestamp('created_at').notNull(),
});

const ticketsRelation = relations(ticketsTable, ({ one, many }) => {
    return {
        event: one(eventsSchema.eventsTable, {
            fields: [ticketsTable.eventId],
            references: [eventsSchema.eventsTable.id],
        }),
        snapshots: many(ticketSnapshotsTable),
        tombstones: many(ticketTombstonesTable),
    };
});

const ticketSnapshotsTable = pgTable('ticket_snapshots', {
    id: varchar('id', { length: 128 }).primaryKey(),
    ticketId: varchar('ticket_id', { length: 128 }).notNull(),
    userEmail: varchar('user_email', { length: 50 }).notNull(),
    userUsername: varchar('user_username', { length: 10 }).notNull(),
    updatedAt: timestamp('created_at').notNull(),
});

const ticketSnapshotsRelation = relations(ticketSnapshotsTable, ({ one }) => {
    return {
        ticket: one(ticketsTable, {
            fields: [ticketSnapshotsTable.ticketId],
            references: [ticketsTable.id],
        }),
    };
});

const ticketTombstonesTable = pgTable('ticket_tombstones', {
    id: varchar('id', { length: 128 }).primaryKey(),
    ticketId: varchar('ticket_id', { length: 128 }).notNull(),
    deletedAt: timestamp('deleted_at').notNull(),
});

const ticketTombstonesRelation = relations(ticketTombstonesTable, ({ one }) => {
    return {
        event: one(ticketsTable, {
            fields: [ticketTombstonesTable.ticketId],
            references: [ticketsTable.id],
        }),
    };
});

export {
    ticketsTable,
    ticketsRelation,
    ticketSnapshotsTable,
    ticketSnapshotsRelation,
    ticketTombstonesTable,
    ticketTombstonesRelation,
};
