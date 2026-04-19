# SymptomSense — AI Health Checker

A minimalist, full-stack Next.js application for educational AI-powered symptom checking, with user authentication, MongoDB storage, and Gemini AI integration.

---

## Features

- **Authentication** — Secure signup/login with JWT cookies, passwords hashed with bcrypt
- **Symptom Checker** — Describe symptoms, get a structured AI analysis from Google Gemini
- **Query History** — Every check is saved per-user in MongoDB; browse past results in the History tab
- **AI Disclaimers** — Prominent warnings on every AI result that it is not medical advice
- **Minimalist UI** — Clean, warm design with DM Serif Display + DM Sans typography

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | MongoDB via Mongoose |
| Auth | JWT + bcrypt |
| AI | Google Gemini 1.5 Flash |
| Styling | CSS Modules |

---

## Project Structure

```
symptom-checker/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts     # POST /api/auth/signup
│   │   │   ├── login/route.ts      # POST /api/auth/login
│   │   │   ├── logout/route.ts     # POST /api/auth/logout
│   │   │   └── me/route.ts         # GET  /api/auth/me
│   │   ├── symptoms/route.ts       # POST /api/symptoms  (calls Gemini)
│   │   └── history/route.ts        # GET  /api/history
│   ├── login/
│   │   ├── page.tsx
│   │   └── auth.module.css
│   ├── signup/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── dashboard.module.css
│   ├── globals.css
│   └── layout.tsx
├── lib/
│   ├── mongodb.ts                  # Mongoose connection helper
│   └── auth.ts                     # JWT sign/verify helpers
├── models/
│   ├── User.ts                     # User schema (name, email, password)
│   └── Query.ts                    # Query schema (userId, symptoms, result)
├── .env.local.example
└── package.json
```

---

## Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd symptom-checker
npm install
```

### 2. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# MongoDB — local or MongoDB Atlas connection string
MONGODB_URI=mongodb://localhost:27017/symptom-checker
# For Atlas: mongodb+srv://<user>:<password>@cluster.mongodb.net/symptom-checker

# JWT secret — use a long random string in production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google Gemini API Key
# Get yours free at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Get a Gemini API Key

1. Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key and paste it into `.env.local` as `GEMINI_API_KEY`

### 4. Set Up MongoDB

**Option A — Local MongoDB:**
```bash
# Install MongoDB Community: https://www.mongodb.com/docs/manual/installation/
# Start the service
mongod --dbpath /data/db
```

**Option B — MongoDB Atlas (Cloud, free tier):**
1. Create a free account at [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Get your connection string and add it to `MONGODB_URI`

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## MongoDB Collections

### `users`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `name` | String | Full name |
| `email` | String | Unique, lowercase |
| `password` | String | bcrypt hash |
| `createdAt` | Date | Account creation time |

### `queries`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `userId` | ObjectId | Reference to `users._id` |
| `symptoms` | String | User's symptom description |
| `result` | String | Gemini AI response |
| `createdAt` | Date | Query timestamp |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | ✗ | Create account |
| POST | `/api/auth/login` | ✗ | Login |
| POST | `/api/auth/logout` | ✗ | Clear session cookie |
| GET | `/api/auth/me` | ✓ | Get current user |
| POST | `/api/symptoms` | ✓ | Analyse symptoms with Gemini |
| GET | `/api/history` | ✓ | Fetch past queries |

---

## ⚠ Medical Disclaimer

This application is built for **educational and demonstration purposes only**. It does not provide medical advice, diagnoses, or treatment recommendations. Always consult a qualified, licensed healthcare professional for any medical concerns.

---

## Production Build

```bash
npm run build
npm start
```

For deployment, use [Vercel](https://vercel.com) (recommended for Next.js) and add your environment variables in the project settings.
