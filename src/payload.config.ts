import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { ExerciseTemplate } from './collections/ExerciseTemplate'
import { TrainingProgram } from './collections/TrainingProgram'
import { TrainingDay } from './collections/TrainingDay'
import { WorkoutSession } from './collections/WorkoutSession'
import { ExerciseLog } from './collections/ExerciseLog'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isDev = process.env.NODE_ENV !== 'production'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Hybrid HIT Tracker',
      description: 'Workout CMS — Dorian Yates × Natty Hybrid HIT',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    ExerciseTemplate,
    TrainingProgram,
    TrainingDay,
    WorkoutSession,
    ExerciseLog,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    /** Dev: auto-push schema dari TypeScript config (tanpa migration manual) */
    push: isDev,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'].filter(
    Boolean,
  ),
  sharp,
})
