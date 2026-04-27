import { pgTable, serial, text, timestamp, real, integer } from 'drizzle-orm/pg-core';

export const casts = pgTable('casts', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  
  // Allow NULL initially
  x: real('x'),
  y: real('y'),
  rotation: integer('rotation'),
  fontSize: real('font_size'),
  driftDirection: real('drift_direction'),
  driftSpeed: real('drift_speed'),
});