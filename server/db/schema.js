import { sql } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, real, integer, index } from 'drizzle-orm/pg-core';


export const casts = pgTable('casts', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  
  // Allow NULL initially
  x: real('x'),
  y: real('y'),
  fontSize: real('font_size'),
  driftDirection: real('drift_direction'),
  driftSpeed: real('drift_speed'),
},
(table) => [
  index('casts_created_at_idx').on(table.createdAt.desc()),
]);
