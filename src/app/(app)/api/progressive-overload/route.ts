import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'
import { suggestProgressiveOverload } from '@/lib/progressive-overload'

const bodySchema = z.object({
  exerciseTemplateId: z.union([z.string(), z.number()]),
  weight: z.number(),
  reps: z.number(),
  rir: z.number().optional(),
})

export async function POST(request: Request) {
  try {
    await requireUser()
    const body = bodySchema.parse(await request.json())
    const payload = await getPayloadClient()

    const template = await payload.findByID({
      collection: 'exercise-templates',
      id: body.exerciseTemplateId,
    })

    const suggestion = suggestProgressiveOverload({
      weight: body.weight,
      reps: body.reps,
      rir: body.rir,
      targetRepsMin: template.targetRepsMin ?? 6,
      targetRepsMax: template.targetRepsMax ?? 10,
      targetRir: template.targetRir ?? 1,
    })

    return NextResponse.json({
      exercise: template.name,
      ...suggestion,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
