import {pgTable, serial, text, timestamp} from 'drizzle-orm/pg-core';

export const casts = pgTable('casts', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
