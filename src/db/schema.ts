// import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// export const classTable = pgTable("classes", {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   class_id: varchar({ length: 255 }).notNull(),
//   class_name: varchar({ length: 255 }).notNull(),
// })

export const classTable = sqliteTable("classes", {
  id: int().primaryKey({ autoIncrement: true }),
  class_id: text().notNull(),
  class_name: text().notNull(),
})

