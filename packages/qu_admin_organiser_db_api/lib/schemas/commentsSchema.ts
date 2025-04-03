import { relations } from "drizzle-orm";
import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { postsSchema } from "./index";

const commentsTable = pgTable('comments', {
    id: varchar('id', { length: 128 }).primaryKey(),
    text: varchar('text', { length: 10 }).notNull(),
    userId: varchar('user_id', { length: 128 }).notNull(),
    userUsername: varchar('user_username', { length: 10 }).notNull(),
    postId: varchar('post_id', { length: 128 }).notNull(),
    createdAt: timestamp('created_at').notNull()
});

const commentsRelation = relations(commentsTable, ({ one }) => {
    return {
        comments: one(postsSchema.postsTable, {
            fields: [commentsTable.postId],
            references: [postsSchema.postsTable.id]
        })
    }
});

export {
    commentsTable,
    commentsRelation
}