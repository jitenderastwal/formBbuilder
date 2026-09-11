import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

import { usersTable } from "./user";

export const formsTable = pgTable("forms", {
  id: uuid("id")
    .primaryKey()
    .defaultRandom(),

  title: varchar("title", { length: 255 })
    .notNull(),

  description: text("description"),

  createdat: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedat: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  createdBy: uuid("created_by")
    .references(() => usersTable.id)
    .notNull(),
}); 