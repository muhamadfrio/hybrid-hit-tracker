import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PROGRAM_DAYS, PROGRAM_DESCRIPTION, PROGRAM_NAME } from './program-data'

async function seed() {
  const payload = await getPayload({ config })

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@hybridhit.local'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'

  const existingPrograms = await payload.find({
    collection: 'training-programs',
    where: { name: { equals: PROGRAM_NAME } },
    limit: 1,
  })

  if (existingPrograms.docs.length > 0) {
    console.log('✓ Program already seeded — skipping.')
    process.exit(0)
  }

  let adminUser = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
  })

  let adminId: number | string

  if (adminUser.docs.length === 0) {
    const created = await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        firstName: 'Hybrid',
        lastName: 'Admin',
      },
    })
    adminId = created.id
    console.log(`✓ Admin user created: ${adminEmail}`)
  } else {
    adminId = adminUser.docs[0]!.id
    console.log(`✓ Using existing admin: ${adminEmail}`)
  }

  const exerciseIdByName = new Map<string, number | string>()

  for (const day of PROGRAM_DAYS) {
    for (const ex of day.exercises) {
      if (exerciseIdByName.has(ex.name)) continue

      const doc = await payload.create({
        collection: 'exercise-templates',
        data: {
          name: ex.name,
          variant: ex.variant,
          muscleGroup: ex.muscleGroup,
          description: ex.description,
          recommendedWarmUpSets: ex.recommendedWarmUpSets,
          recommendedWorkingSets: ex.recommendedWorkingSets,
          defaultSetType: ex.defaultSetType,
          targetRepsMin: ex.targetRepsMin ?? 6,
          targetRepsMax: ex.targetRepsMax ?? 10,
          targetRir: ex.targetRir ?? 1,
        },
      })
      exerciseIdByName.set(ex.name, doc.id)
    }
  }

  console.log(`✓ Created ${exerciseIdByName.size} exercise templates`)

  const program = await payload.create({
    collection: 'training-programs',
    data: {
      name: PROGRAM_NAME,
      description: PROGRAM_DESCRIPTION,
      startDate: new Date().toISOString(),
      isActive: true,
      createdBy: adminId,
    },
  })

  for (const day of PROGRAM_DAYS) {
    const exerciseIds = day.exercises.map((e) => exerciseIdByName.get(e.name)!)

    await payload.create({
      collection: 'training-days',
      data: {
        program: program.id,
        dayName: day.dayName,
        dayOrder: day.dayOrder,
        exercises: exerciseIds,
      },
    })
  }

  const athleteEmail = process.env.SEED_ATHLETE_EMAIL || 'athlete@hybridhit.local'
  const athleteExists = await payload.find({
    collection: 'users',
    where: { email: { equals: athleteEmail } },
    limit: 1,
  })

  if (athleteExists.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: athleteEmail,
        password: process.env.SEED_ATHLETE_PASSWORD || 'Athlete123!',
        role: 'athlete',
        firstName: 'Demo',
        lastName: 'Athlete',
      },
    })
    console.log(`✓ Demo athlete: ${athleteEmail}`)
  }

  console.log(`✓ Program "${PROGRAM_NAME}" seeded with ${PROGRAM_DAYS.length} training days`)
  console.log('  Run: npm run dev — schema auto-pushes in development')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
