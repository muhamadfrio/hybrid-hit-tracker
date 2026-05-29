export type OverloadInput = {
  weight: number
  reps: number
  rir?: number | null
  targetRepsMin: number
  targetRepsMax: number
  targetRir?: number
}

export type OverloadSuggestion = {
  shouldIncreaseWeight: boolean
  suggestedWeightKg: number | null
  incrementKg: number
  message: string
  reason: string
}

const INCREMENT_COMPOUND = 2.5
const INCREMENT_ISOLATION = 1.25

/**
 * Progressive overload: jika rep mencapai atas range dengan RIR ≤ target → naikkan beban.
 */
export function suggestProgressiveOverload(input: OverloadInput): OverloadSuggestion {
  const {
    weight,
    reps,
    rir = 0,
    targetRepsMin,
    targetRepsMax,
    targetRir = 1,
  } = input

  const increment =
    targetRepsMax <= 8 ? INCREMENT_COMPOUND : INCREMENT_ISOLATION

  const hitRepTarget = reps >= targetRepsMax
  const rirOk = (rir ?? 0) <= targetRir

  if (hitRepTarget && rirOk) {
    const suggested = Math.round((weight + increment) * 100) / 100
    return {
      shouldIncreaseWeight: true,
      suggestedWeightKg: suggested,
      incrementKg: increment,
      message: `Naikkan beban ke ${suggested} kg (+${increment} kg) pada sesi berikutnya.`,
      reason: `Mencapai ${reps} rep (target ${targetRepsMin}–${targetRepsMax}) dengan RIR ${rir ?? 0}.`,
    }
  }

  if (reps < targetRepsMin) {
    return {
      shouldIncreaseWeight: false,
      suggestedWeightKg: null,
      incrementKg: increment,
      message: 'Pertahankan beban; fokus mencapai rep minimum terlebih dahulu.',
      reason: `Rep ${reps} di bawah target minimum ${targetRepsMin}.`,
    }
  }

  return {
    shouldIncreaseWeight: false,
    suggestedWeightKg: null,
    incrementKg: increment,
    message: 'Pertahankan beban; tambah rep atau turunkan RIR sebelum naik beban.',
    reason: `Rep ${reps} dalam range tapi belum siap overload (RIR ${rir ?? 0}, target RIR ≤${targetRir}).`,
  }
}
