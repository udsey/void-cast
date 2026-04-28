ALTER TABLE "casts" ADD COLUMN "drift_direction" real;--> statement-breakpoint
ALTER TABLE "casts" ADD COLUMN "drift_speed" real;--> statement-breakpoint
ALTER TABLE "casts" DROP COLUMN "drift_amplitude_x";--> statement-breakpoint
ALTER TABLE "casts" DROP COLUMN "drift_amplitude_y";--> statement-breakpoint
ALTER TABLE "casts" DROP COLUMN "drift_frequency_x";--> statement-breakpoint
ALTER TABLE "casts" DROP COLUMN "drift_frequency_y";--> statement-breakpoint
ALTER TABLE "casts" DROP COLUMN "drift_phase_x";--> statement-breakpoint
ALTER TABLE "casts" DROP COLUMN "drift_phase_y";