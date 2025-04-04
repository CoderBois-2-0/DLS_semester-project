import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { commentsSchema } from './index';

const postsTable = pgTable('posts', {
    id: varchar('id', { length: 128 }).primaryKey(),
    userId: varchar('user_id', { length: 128 }).notNull(),
    createdAt: timestamp('created_at').notNull(),
});

const postsRelation = relations(postsTable, ({ many }) => {
    return {
        comments: many(commentsSchema.commentsTable),
        snapshots: many(postSnapshotsTable),
        tombstones: many(postTombstonesTable)
    };
});


const postSnapshotsTable = pgTable('post_snapshots', {
    id: varchar('id', { length: 128 }).primaryKey(),
    postId: varchar('post_id', { length: 128 }).notNull(),
    title: varchar('title', { length: 10 }).notNull(),
    text: varchar('text', { length: 10 }).notNull(),
    userUsername: varchar('user_username', { length: 10 }).notNull(),
    updatedAt: timestamp('updated_at').notNull(),
});

const postSnapshotsRelation = relations(postSnapshotsTable, ({ one }) => {
    return {
        post: one(postsTable, {
            fields: [postSnapshotsTable.postId],
            references: [postsTable.id]
        })
    };
});


const postTombstonesTable = pgTable('post_tombstones', {
    id: varchar('id', { length: 128 }),
    postId: varchar('post_id', { length: 128 }).notNull(),
    deletedAt: timestamp('deleted_at').notNull(),
});

const postTombstonesRelation = relations(postTombstonesTable, ({ one }) => {
    return {
        post: one(postsTable, {
            fields: [postTombstonesTable.postId],
            references: [postsTable.id]
        })
    };
});


export { postsTable, postsRelation, postSnapshotsTable, postSnapshotsRelation, postTombstonesTable, postTombstonesRelation };
