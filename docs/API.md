# Hybrid HIT Tracker — API Reference

Base URL: `http://localhost:3000` (atau `NEXT_PUBLIC_SERVER_URL`)

Payload menyediakan **REST** dan **GraphQL** otomatis untuk setiap collection.

## Authentication

### Login (REST)

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "athlete@hybridhit.local",
  "password": "Athlete123!"
}
```

Response menyertakan cookie `payload-token` — gunakan di mobile app (simpan token / cookie).

### Current user

```http
GET /api/users/me
Cookie: payload-token=...
```

### Logout

```http
POST /api/users/logout
```

---

## Collections (REST)

| Collection | Slug | Endpoint |
|------------|------|----------|
| Users | `users` | `/api/users` |
| Exercise Templates | `exercise-templates` | `/api/exercise-templates` |
| Training Programs | `training-programs` | `/api/training-programs` |
| Training Days | `training-days` | `/api/training-days` |
| Workout Sessions | `workout-sessions` | `/api/workout-sessions` |
| Exercise Logs | `exercise-logs` | `/api/exercise-logs` |

### Contoh: program aktif

```http
GET /api/training-programs?where[isActive][equals]=true
```

### Contoh: hari latihan + exercises (depth)

```http
GET /api/training-days?where[program][equals]=PROGRAM_ID&sort=dayOrder&depth=2
```

### Contoh: buat workout session

```http
POST /api/workout-sessions
Content-Type: application/json
Cookie: payload-token=...

{
  "program": 1,
  "trainingDay": 1,
  "date": "2026-05-29",
  "feeling": 4,
  "notes": "Sesión bagus"
}
```

> Field `user` diisi otomatis dari user yang login (hook).

### Contoh: log set

```http
POST /api/exercise-logs
Content-Type: application/json

{
  "workoutSession": 1,
  "exerciseTemplate": 3,
  "setType": "all-out",
  "setNumber": 3,
  "weight": 32.5,
  "reps": 8,
  "rir": 1,
  "completedAt": "2026-05-29T10:30:00.000Z"
}
```

---

## Custom App API (Next.js)

### Dashboard stats

```http
GET /api/dashboard
Cookie: payload-token=...
```

Response:

```json
{
  "weeklyVolume": [{ "week": "26 Mei", "volume": 12450 }],
  "personalRecords": [{ "exerciseName": "Leg Press", "maxWeight": 180, "reps": 10, "date": "28 Mei 2026" }],
  "totalSessions": 12
}
```

### Progressive overload suggestion

```http
POST /api/progressive-overload
Content-Type: application/json

{
  "exerciseTemplateId": 1,
  "weight": 30,
  "reps": 10,
  "rir": 1
}
```

Response:

```json
{
  "exercise": "Incline Dumbbell Bench Press",
  "shouldIncreaseWeight": true,
  "suggestedWeightKg": 32.5,
  "incrementKg": 2.5,
  "message": "Naikkan beban ke 32.5 kg (+2.5 kg) pada sesi berikutnya.",
  "reason": "Mencapai 10 rep (target 6–8) dengan RIR 1."
}
```

---

## GraphQL

- Endpoint: `POST /api/graphql`
- Playground (dev): `GET /api/graphql-playground`

Contoh query:

```graphql
query ActiveProgram {
  TrainingPrograms(where: { isActive: { equals: true } }) {
    docs {
      id
      name
      description
    }
  }
}
```

Schema file di-generate ke `src/generated-schema.graphql` saat dev/build.

---

## Access control summary

| Role | Programs/Templates | Own sessions/logs | All sessions/logs |
|------|-------------------|-------------------|-------------------|
| athlete | read | CRUD | — |
| coach | read + manage program | CRUD own | read all |
| admin | full | full | full |

---

## Mobile app (Flutter / React Native)

1. Login → simpan `payload-token`
2. Sync program: `GET /api/training-programs` + `training-days?depth=2`
3. Submit session + logs via REST di atas
4. Panggil `/api/progressive-overload` setelah set kerja
5. Dashboard: `GET /api/dashboard`

Gunakan header `Authorization: JWT <token>` jika mengaktifkan JWT strategy di Payload (opsional).
