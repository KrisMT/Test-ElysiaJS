import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: ['./src/db/schema.ts', './src/db/auth-schema.ts'],
  // dilect: 'postgresql',
  dialect: 'sqlite',
  dbCredentials: {
    // url: process.env.DATABASE_URL!,
    url: process.env.DB_FILE_NAME!,
  },
})
