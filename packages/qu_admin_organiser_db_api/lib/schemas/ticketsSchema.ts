import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { eventsSchema } from './index';

const ticketsTable = pgTable('tickets', {
    id: varchar('id', { length: 128 }).primaryKey(),
    eventId: varchar('event_id', { length: 128 }).notNull(),
    userId: varchar('user_id', { length: 128 }).notNull(),
    userEmail: varchar('user_email', { length: 50 }).notNull(),
    userUsername: varchar('user_username', { length: 10 }).notNull(),
    createdAt: timestamp('created_at').notNull(),
});

const ticketsRelation = relations(ticketsTable, ({ one }) => {
    return {
        event: one(eventsSchema.eventsTable, {
            fields: [ticketsTable.eventId],
            references: [eventsSchema.eventsTable.id],
        }),
    };
});

export { ticketsTable, ticketsRelation };
