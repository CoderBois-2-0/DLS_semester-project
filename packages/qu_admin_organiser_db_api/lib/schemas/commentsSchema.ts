import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { postsSchema } from './index';

const commentsTable = pgTable('comments', {
    id: varchar('id', { length: 128 }).primaryKey(),
    userId: varchar('user_id', { length: 128 }).notNull(),
    postId: varchar('post_id', { length: 128 }).notNull(),
    createdAt: timestamp('created_at').notNull(),
});

const commentsRelation = relations(commentsTable, ({ one, many }) => {
    return {
        post: one(postsSchema.postsTable, {
            fields: [commentsTable.postId],
            references: [postsSchema.postsTable.id],
        }),
        snapshots: many(commentSnapshotsTable),
        tombstones: many(commentTombstonesTable),
    };
});

const commentSnapshotsTable = pgTable('comment_snapshots', {
    id: varchar('id', { length: 128 }).primaryKey(),
    commentId: varchar('comment_id', { length: 128 }).notNull(),
    text: varchar('text', { length: 10 }).notNull(),
    userUsername: varchar('user_username', { length: 10 }).notNull(),
    updatedAt: timestamp('updated_at').notNull(),
});

const commentSnapshotsRelation = relations(commentSnapshotsTable, ({ one }) => {
    return {
        comment: one(commentsTable, {
            fields: [commentSnapshotsTable.commentId],
            references: [commentsTable.id],
        }),
    };
});

const commentTombstonesTable = pgTable('comment_tombstones', {
    id: varchar('id', { length: 128 }).primaryKey(),
    commentId: varchar('comment_id', { length: 128 }).notNull(),
    deletedId: timestamp('deleted_id').notNull(),
});

const commentTombstonesRelation = relations(
    commentTombstonesTable,
    ({ one }) => {
        return {
            comment: one(commentsTable, {
                fields: [commentTombstonesTable.commentId],
                references: [commentsTable.id],
            }),
        };
    }
);

export {
    commentsTable,
    commentsRelation,
    commentSnapshotsTable,
    commentSnapshotsRelation,
    commentTombstonesTable,
    commentTombstonesRelation,
};
