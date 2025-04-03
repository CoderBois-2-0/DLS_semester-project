import { relations } from "drizzle-orm";
import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { commentsSchema } from "./index";

const postsTable = pgTable('posts', {
    id: varchar('id', { length: 128 }).primaryKey(),
    title: varchar('title', { length: 10 }).notNull(),
    text: varchar('text', { length: 10 }).notNull(),
    userId: varchar('user_id', { length: 128 }).notNull(),
    userUsername: varchar('user_username', { length: 10 }).notNull(),
    createdAt: timestamp('created_at').notNull()
});

const postsRelation = relations(postsTable, ({ many }) => {
    return {
        comments: many(commentsSchema.commentsTable)
    }
});

export {
    postsTable,
    postsRelation
};