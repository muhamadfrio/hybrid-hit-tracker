# Hybrid HIT Tracker

Aplikasi pelacakan latihan **Hybrid HIT** (Dorian Yates × Natty Adjustment) — program 4 hari dengan CMS admin (Payload 3), frontend atlet (Next.js 15), dan database PostgreSQL.

## Fitur

- **Admin / Coach** — kelola template latihan, program, hari latihan, dan data atlet di Payload Admin
- **Athlete App** — login, log sesi workout, dashboard progress, dan saran progressive overload
- **Seed** — program demo, template exercise, akun admin & atlet siap pakai

## Prasyarat

| Tool | Versi |
|------|--------|
| [Node.js](https://nodejs.org/) | ≥ 20.9.0 |
| [Docker](https://www.docker.com/) (opsional, untuk PostgreSQL lokal) | — |

## Cara menjalankan (development)

### 1. Clone & install dependensi

```bash
cd hybrid-hit-tracker
npm install
```

### 2. Jalankan PostgreSQL

**Opsi A — Docker (disarankan)**

```bash
docker compose up -d
```

Database default: `postgresql://payload:payload@localhost:5432/hybrid_hit`

**Opsi B — PostgreSQL yang sudah ada**

Sesuaikan `DATABASE_URI` di `.env` dengan connection string Anda.

### 3. Konfigurasi environment

```bash
cp .env.example .env
```

Edit `.env` minimal untuk:

- `DATABASE_URI` — harus mengarah ke database yang aktif
- `PAYLOAD_SECRET` — string acak panjang (min. 32 karakter) untuk production

Variabel lain punya default yang cocok untuk development lokal.

### 4. Seed data awal (sekali)

Isi database dengan program latihan, exercise templates, dan akun demo:

```bash
npm run seed
```

Akun default setelah seed (bisa diubah lewat `.env`):

| Peran | Email | Password default |
|-------|--------|------------------|
| Admin | `admin@hybridhit.local` | `ChangeMe123!` |
| Atlet demo | `athlete@hybridhit.local` | `Athlete123!` |

> Seed aman dijalankan ulang: jika program sudah ada, proses akan berhenti tanpa duplikasi.

### 5. Jalankan server development

```bash
npm run dev
```

Di mode development, schema database di-**push** otomatis dari konfigurasi Payload (tidak perlu migration manual).

Buka di browser:

| URL | Keterangan |
|-----|------------|
| http://localhost:3000 | Beranda & app atlet |
| http://localhost:3000/login | Login atlet |
| http://localhost:3000/dashboard | Dashboard (setelah login) |
| http://localhost:3000/workout | Log workout |
| http://localhost:3000/admin | Panel admin Payload |

## Production

```bash
npm run build
npm run start
```

Untuk production:

1. Set `NODE_ENV=production`
2. Gunakan `PAYLOAD_SECRET` dan `DATABASE_URI` yang aman
3. Jalankan migration Payload (schema tidak di-push otomatis di production):

```bash
npm run migrate
```

## Perintah npm

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Server development Next.js |
| `npm run devsafe` | Hapus cache `.next` lalu `dev` |
| `npm run build` | Build production |
| `npm run start` | Jalankan build production |
| `npm run seed` | Isi data program & akun demo |
| `npm run migrate` | Jalankan migration database |
| `npm run migrate:create` | Buat file migration baru |
| `npm run generate:types` | Generate TypeScript types dari Payload |
| `npm run lint` | ESLint |

## Variabel environment

Lihat [.env.example](.env.example) untuk daftar lengkap.

| Variabel | Wajib | Keterangan |
|----------|-------|------------|
| `DATABASE_URI` | Ya | Connection string PostgreSQL |
| `PAYLOAD_SECRET` | Ya | Secret enkripsi Payload |
| `NEXT_PUBLIC_SERVER_URL` | Ya | URL publik app (CORS & link), default `http://localhost:3000` |
| `SEED_ADMIN_EMAIL` | Tidak | Email admin saat `npm run seed` |
| `SEED_ADMIN_PASSWORD` | Tidak | Password admin saat seed |
| `SEED_ATHLETE_EMAIL` | Tidak | Email atlet demo |
| `SEED_ATHLETE_PASSWORD` | Tidak | Password atlet demo |

## Struktur singkat

```
src/
├── app/(app)/          # UI atlet (dashboard, workout, login)
├── app/(payload)/        # Admin Payload & REST/GraphQL API
├── collections/        # Skema CMS (users, program, log, dll.)
├── seed/               # Data program Hybrid HIT
└── payload.config.ts   # Konfigurasi Payload + PostgreSQL
```

## Troubleshooting

**Koneksi database gagal**

- Pastikan PostgreSQL berjalan: `docker compose ps`
- Cek `DATABASE_URI` di `.env` sama dengan user/password/database di `docker-compose.yml`

**Halaman admin kosong / error setelah upgrade**

```bash
npm run devsafe
npm run generate:importmap
```

**Port 3000 sudah dipakai**

```bash
PORT=3001 npm run dev
```

Jangan lupa set `NEXT_PUBLIC_SERVER_URL=http://localhost:3001` di `.env`.

## Lisensi

MIT
