import 'dotenv/config'
// import { drizzle } from 'drizzle-orm/node-postgres'
import { drizzle } from 'drizzle-orm/libsql'

// const db = drizzle(process.env.DATABASE_URL)
const db = drizzle(process.env.DB_FILE_NAME!)

