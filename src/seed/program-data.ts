/**
 * PROGRAM LATIHAN 4 HARI — HYBRID HIT (Dorian Yates × Natty Adjustment)
 * Seed data berdasarkan struktur program Excel Hybrid HIT.
 */

export type SeedExercise = {
  name: string
  variant: string
  muscleGroup: string
  description: string
  recommendedWarmUpSets: number
  recommendedWorkingSets: number
  defaultSetType: 'warm-up' | 'working' | 'all-out' | 'drop-set'
  targetRepsMin?: number
  targetRepsMax?: number
  targetRir?: number
}

export type SeedDay = {
  dayName: 'push' | 'pull' | 'legs' | 'deadlift-shoulders'
  dayOrder: number
  exercises: SeedExercise[]
}

export const PROGRAM_NAME =
  'PROGRAM LATIHAN 4 HARI — HYBRID HIT (Dorian Yates × Natty Adjustment)'

export const PROGRAM_DESCRIPTION = `Program 4 hari Hybrid HIT menggabungkan prinsip High Intensity Training (Dorian Yates) dengan penyesuaian natural (volume terkontrol, RIR 0–2 pada set kerja).

Prinsip:
• 1 set kerja all-out per gerakan utama (setelah warm-up)
• Rep range 6–10 untuk hypertrophy, 4–6 untuk compound berat
• Rest 2–3 menit antar gerakan
• Progressive overload: naikkan beban saat mencapai rep atas range dengan RIR ≤1

Natty adjustment: volume tambahan ringan pada muscle group sekunder, tidak meniru volume pro enhanced.`

export const PROGRAM_DAYS: SeedDay[] = [
  {
    dayName: 'push',
    dayOrder: 1,
    exercises: [
      {
        name: 'Incline Dumbbell Bench Press',
        variant: 'Upper Chest — Prioritas',
        muscleGroup: 'Chest (Upper)',
        description:
          'Sudut bench 30–45°. Retraksi scapula, dumbbell turun ke bagian atas dada. Dorong dengan siku ~45°, jangan lockout penuh di atas. Set kerja: 1 set all-out 6–8 rep, RIR 0–1.',
        recommendedWarmUpSets: 2,
        recommendedWorkingSets: 1,
        defaultSetType: 'all-out',
        targetRepsMin: 6,
        targetRepsMax: 8,
        targetRir: 1,
      },
      {
        name: 'Machine Chest Press',
        variant: 'Mid Chest — Volume',
        muscleGroup: 'Chest (Mid)',
        description:
          'Kursi diset agar handle sejajar pertengahan dada. Tekan eksplosif, negatif 2–3 detik. 1 set kerja 8–10 rep. Jangan membalikkan motion di atas.',
        recommendedWarmUpSets: 1,
        recommendedWorkingSets: 1,
        defaultSetType: 'working',
        targetRepsMin: 8,
        targetRepsMax: 10,
        targetRir: 1,
      },
      {
        name: 'Cable Fly (Low to High)',
        variant: 'Upper Chest — Finisher',
        muscleGroup: 'Chest (Upper)',
        description:
          'Kabel dari bawah ke atas, fokus squeeze di puncak. Lengan sedikit bengkok tetap. 1 set 10–12 rep dengan kontrol penuh.',
        recommendedWarmUpSets: 0,
        recommendedWorkingSets: 1,
        defaultSetType: 'working',
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRir: 2,
      },
      {
        name: 'Machine Shoulder Press',
        variant: 'Delts — Prioritas',
        muscleGroup: 'Shoulders (Front/Mid)',
        description:
          'Duduk, punggung menempel pad. Tekan overhead tanpa membusurkan punggung. Set all-out 6–8 rep. Warm-up progresif 2 set ringan.',
        recommendedWarmUpSets: 2,
        recommendedWorkingSets: 1,
        defaultSetType: 'all-out',
        targetRepsMin: 6,
        targetRepsMax: 8,
        targetRir: 1,
      },
      {
        name: 'Cable Lateral Raise',
        variant: 'Side Delts — Volume',
        muscleGroup: 'Shoulders (Side)',
        description:
          'Satu lengan, kabel rendah. Angkat hingga sejajar bahu, jangan swing. 1 set 12–15 rep slow eccentric.',
        recommendedWarmUpSets: 0,
        recommendedWorkingSets: 1,
        defaultSetType: 'working',
        targetRepsMin: 12,
        targetRepsMax: 15,
        targetRir: 2,
      },
      {
        name: 'Rope Triceps Pushdown',
        variant: 'Triceps — Finisher',
        muscleGroup: 'Triceps',
        description:
          'Siku menempel tubuh, rentangkan lengan bawah penuh. Split rope di bawah untuk kontraksi maksimal. 1 set 10–12 rep.',
        recommendedWarmUpSets: 1,
        recommendedWorkingSets: 1,
        defaultSetType: 'working',
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRir: 1,
      },
    ],
  },
  {
    dayName: 'pull',
    dayOrder: 2,
    exercises: [
      {
        name: 'Neutral Grip Lat Pulldown',
        variant: 'Lats — Prioritas',
        muscleGroup: 'Back (Lats)',
        description:
          'Genggam netral, tarik ke atas dada atas. Lean sedikit ke belakang, squeeze 1 detik. Set all-out 6–8 rep. Hindari memakai momentum berlebihan.',
        recommendedWarmUpSets: 2,
        recommendedWorkingSets: 1,
        defaultSetType: 'all-out',
        targetRepsMin: 6,
        targetRepsMax: 8,
        targetRir: 1,
      },
      {
        name: 'Chest-Supported T-Bar Row',
        variant: 'Mid Back — Volume',
        muscleGroup: 'Back (Mid)',
        description:
          'Dada di bench, tarik ke perut bawah. Siku dekat tubuh. 1 set kerja 8–10 rep dengan pause di kontraksi.',
        recommendedWarmUpSets: 1,
        recommendedWorkingSets: 1,
        defaultSetType: 'working',
        targetRepsMin: 8,
        targetRepsMax: 10,
        targetRir: 1,
      },
      {
        name: 'Straight-Arm Pulldown',
        variant: 'Lats — Isolation',
        muscleGroup: 'Back (Lats)',
        description:
          'Lengan hampir lurus, gerakan hanya di bahu. Fokus stretch di atas. 1 set 10–12 rep.',
        recommendedWarmUpSets: 0,
        recommendedWorkingSets: 1,
        defaultSetType: 'working',
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRir: 2,
      },
      {
        name: 'Face Pull',
        variant: 'Rear Delts — Health',
        muscleGroup: 'Shoulders (Rear)',
        description:
          'Tarik ke wajah, siku tinggi, rotate external di puncak. 2 set ringan 15–20 rep (natty shoulder health).',
        recommendedWarmUpSets: 0,
        recommendedWorkingSets: 2,
        defaultSetType: 'working',
        targetRepsMin: 15,
        targetRepsMax: 20,
        targetRir: 2,
      },
      {
        name: 'Incline Dumbbell Curl',
        variant: 'Biceps — Prioritas',
        muscleGroup: 'Biceps',
        description:
          'Bench 45°, lengan menggantung. Curl tanpa menggerakkan siku ke depan. 1 set all-out 6–8 rep.',
        recommendedWarmUpSets: 1,
        recommendedWorkingSets: 1,
        defaultSetType: 'all-out',
        targetRepsMin: 6,
        targetRepsMax: 8,
        targetRir: 1,
      },
      {
        name: 'Hammer Curl',
        variant: 'Brachialis — Finisher',
        muscleGroup: 'Biceps / Forearms',
        description:
          'Genggam netral, alternasi atau bersamaan. 1 set 10–12 rep. Drop set opsional jika recovery baik.',
        recommendedWarmUpSets: 0,
        recommendedWorkingSets: 1,
        defaultSetType: 'drop-set',
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRir: 2,
      },
    ],
  },
  {
    dayName: 'legs',
    dayOrder: 3,
    exercises: [
      {
        name: 'Leg Press',
        variant: 'Quads — Prioritas',
        muscleGroup: 'Quadriceps',
        description:
          'Kaki medium width, turun hingga 90° atau sedikit di bawah jika mobilitas memungkinkan. Jangan lockout keras. Set all-out 8–10 rep. Warm-up 2 set progresif.',
        recommendedWarmUpSets: 2,
        recommendedWorkingSets: 1,
        defaultSetType: 'all-out',
        targetRepsMin: 8,
        targetRepsMax: 10,
        targetRir: 1,
      },
      {
        name: 'Lying Leg Curl',
        variant: 'Hamstrings — Prioritas',
        muscleGroup: 'Hamstrings',
        description:
          'Pinggul menempel bench, curl penuh tanpa mengangkat pinggul. Pause di kontraksi. 1 set 8–10 rep.',
        recommendedWarmUpSets: 1,
        recommendedWorkingSets: 1,
        defaultSetType: 'all-out',
        targetRepsMin: 8,
        targetRepsMax: 10,
        targetRir: 1,
      },
      {
        name: 'Hack Squat',
        variant: 'Quads — Volume',
        muscleGroup: 'Quadriceps',
        description:
          'Kaki sedikit ke depan untuk kuads. Turun terkontrol 3 detik. 1 set 10–12 rep.',
        recommendedWarmUpSets: 1,
        recommendedWorkingSets: 1,
        defaultSetType: 'working',
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRir: 2,
      },
      {
        name: 'Standing Calf Raise',
        variant: 'Calves — Volume',
        muscleGroup: 'Calves',
        description:
          'Full stretch di bawah, pause di atas 2 detik. 2 set 12–15 rep (calves toleran volume natty).',
        recommendedWarmUpSets: 0,
        recommendedWorkingSets: 2,
        defaultSetType: 'working',
        targetRepsMin: 12,
        targetRepsMax: 15,
        targetRir: 2,
      },
    ],
  },
  {
    dayName: 'deadlift-shoulders',
    dayOrder: 4,
    exercises: [
      {
        name: 'Romanian Deadlift',
        variant: 'Posterior Chain — Prioritas',
        muscleGroup: 'Hamstrings / Glutes / Erectors',
        description:
          'Barbell atau dumbbell, hip hinge, bar dekat kaki. Stretch hamstring di bawah, lockout glute di atas. Set all-out 6–8 rep. Jangan round lower back.',
        recommendedWarmUpSets: 2,
        recommendedWorkingSets: 1,
        defaultSetType: 'all-out',
        targetRepsMin: 6,
        targetRepsMax: 8,
        targetRir: 1,
      },
      {
        name: 'Barbell Shrug',
        variant: 'Traps — Volume',
        muscleGroup: 'Trapezius',
        description:
          'Angkat bahu vertikal, jangan roll. Hold 1 detik di atas. 1 set 10–12 rep.',
        recommendedWarmUpSets: 1,
        recommendedWorkingSets: 1,
        defaultSetType: 'working',
        targetRepsMin: 10,
        targetRepsMax: 12,
        targetRir: 2,
      },
      {
        name: 'Seated Dumbbell Shoulder Press',
        variant: 'Delts — Prioritas',
        muscleGroup: 'Shoulders',
        description:
          'Dumbbell, neutral atau pronasi. Set all-out 6–8 rep setelah warm-up.',
        recommendedWarmUpSets: 2,
        recommendedWorkingSets: 1,
        defaultSetType: 'all-out',
        targetRepsMin: 6,
        targetRepsMax: 8,
        targetRir: 1,
      },
      {
        name: 'Reverse Pec Deck',
        variant: 'Rear Delts — Finisher',
        muscleGroup: 'Shoulders (Rear)',
        description:
          'Dada di pad, buka lengan ke belakang. 1 set 12–15 rep controlled.',
        recommendedWarmUpSets: 0,
        recommendedWorkingSets: 1,
        defaultSetType: 'working',
        targetRepsMin: 12,
        targetRepsMax: 15,
        targetRir: 2,
      },
      {
        name: 'Barbell Curl',
        variant: 'Biceps — Maintenance',
        muscleGroup: 'Biceps',
        description:
          'EZ atau straight bar. 1 set 8–10 rep, tidak perlu failure total jika recovery rendah.',
        recommendedWarmUpSets: 0,
        recommendedWorkingSets: 1,
        defaultSetType: 'working',
        targetRepsMin: 8,
        targetRepsMax: 10,
        targetRir: 2,
      },
    ],
  },
]
