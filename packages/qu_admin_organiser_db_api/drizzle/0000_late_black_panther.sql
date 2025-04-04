CREATE TABLE "comments" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"text" varchar(10) NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"user_username" varchar(10) NOT NULL,
	"post_id" varchar(128) NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(10) NOT NULL,
	"price" real,
	"user_id" varchar(128) NOT NULL,
	"user_email" varchar(50) NOT NULL,
	"user_username" varchar(10) NOT NULL,
	"location" varchar(50),
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"title" varchar(10) NOT NULL,
	"text" varchar(10) NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"user_username" varchar(10) NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"event_id" varchar(128) NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"user_email" varchar(50) NOT NULL,
	"user_username" varchar(10) NOT NULL,
	"created_at" timestamp NOT NULL
);
