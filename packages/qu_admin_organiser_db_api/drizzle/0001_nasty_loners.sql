CREATE TABLE "comment_snapshots" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"comment_id" varchar(128) NOT NULL,
	"text" varchar(10) NOT NULL,
	"user_username" varchar(10) NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comment_tombstones" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"comment_id" varchar(128) NOT NULL,
	"deleted_id" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_snapshots" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(10) NOT NULL,
	"price" real NOT NULL,
	"user_email" varchar(50) NOT NULL,
	"user_username" varchar(10) NOT NULL,
	"location" varchar(50),
	"updated_at" timestamp NOT NULL,
	"event_id" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_tombstones" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"event_id" varchar(128) NOT NULL,
	"deleted_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_snapshots" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"post_id" varchar(128) NOT NULL,
	"title" varchar(10) NOT NULL,
	"text" varchar(10) NOT NULL,
	"user_username" varchar(10) NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_tombstones" (
	"id" varchar(128),
	"post_id" varchar(128) NOT NULL,
	"deleted_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_snapshots" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"ticket_id" varchar(128) NOT NULL,
	"user_email" varchar(50) NOT NULL,
	"user_username" varchar(10) NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_tombstones" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"ticket_id" varchar(128) NOT NULL,
	"deleted_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "text";--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "user_username";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "user_email";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "user_username";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "text";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "user_username";--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN "user_email";--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN "user_username";