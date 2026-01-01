CREATE TABLE "brands" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"language" text DEFAULT 'de' NOT NULL,
	"tonality" text NOT NULL,
	"dos" text DEFAULT '' NOT NULL,
	"donts" text DEFAULT '' NOT NULL,
	"usp" text DEFAULT '' NOT NULL,
	"cta_default" text DEFAULT '' NOT NULL,
	"examples" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "draft_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"draft_id" text NOT NULL,
	"version" integer NOT NULL,
	"content_json" text NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drafts" (
	"id" text PRIMARY KEY NOT NULL,
	"brand_id" text NOT NULL,
	"platform" text DEFAULT 'tiktok' NOT NULL,
	"brief" text NOT NULL,
	"style" text NOT NULL,
	"length_sec" integer NOT NULL,
	"goal" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generations" (
	"id" text PRIMARY KEY NOT NULL,
	"draft_id" text NOT NULL,
	"prompt_name" text NOT NULL,
	"prompt_version" text NOT NULL,
	"input_hash" text NOT NULL,
	"output_json" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");