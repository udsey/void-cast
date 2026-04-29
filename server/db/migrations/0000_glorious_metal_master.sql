CREATE TABLE "casts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp,
	"x" real,
	"y" real,
	"font_size" real,
	"drift_direction" real,
	"drift_speed" real
);
--> statement-breakpoint
CREATE INDEX "casts_created_at_idx" ON "casts" USING btree ("created_at" DESC NULLS LAST);