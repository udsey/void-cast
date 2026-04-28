ALTER TABLE "casts" ADD COLUMN "x" real NOT NULL;--> statement-breakpoint
ALTER TABLE "casts" ADD COLUMN "y" real NOT NULL;--> statement-breakpoint
ALTER TABLE "casts" ADD COLUMN "rotation" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "casts" ADD COLUMN "font_size" real NOT NULL;--> statement-breakpoint
ALTER TABLE "casts" ADD COLUMN "drift_amplitude_x" real NOT NULL;--> statement-breakpoint
ALTER TABLE "casts" ADD COLUMN "drift_amplitude_y" real NOT NULL;--> statement-breakpoint
ALTER TABLE "casts" ADD COLUMN "drift_frequency_x" real NOT NULL;--> statement-breakpoint
ALTER TABLE "casts" ADD COLUMN "drift_frequency_y" real NOT NULL;--> statement-breakpoint
ALTER TABLE "casts" ADD COLUMN "drift_phase_x" real NOT NULL;--> statement-breakpoint
ALTER TABLE "casts" ADD COLUMN "drift_phase_y" real NOT NULL;