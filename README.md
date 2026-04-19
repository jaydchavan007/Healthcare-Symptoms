# SymptomSense — AI Health Checker

A minimalist, full-stack Next.js application for educational AI-powered symptom checking, with user authentication, MongoDB storage, and Gemini AI integration.

---

## Video Demo



https://github.com/user-attachments/assets/9d7cb83b-7840-44ec-b116-9364912f3e38



## Features

- **Authentication** — Secure signup/login with JWT cookies, passwords hashed with bcrypt
- **Symptom Checker** — Describe symptoms, get a structured Gemini LLM analysis from Google Gemini
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
| AI | Google gemini-3.1-flash-lite-preview |
| Styling | CSS Modules |

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


##  Medical Disclaimer

This application is built for **educational and demonstration purposes only**. It does not provide medical advice, diagnoses, or treatment recommendations. Always consult a qualified, licensed healthcare professional for any medical concerns.
