# 📚 Daily Learning Tracker

A clean, minimal web app to track your daily learning — built with Next.js 14 (App Router), Tailwind CSS, and MongoDB Atlas.

---

## ✨ Features

- 📊 **Dashboard** — Stats: days completed, current streak, challenge progress
- ➕ **Add Entry** — Log day, topic, subtopic, notes with auto-day detection
- 📋 **View Entries** — Sorted day-wise with search + topic filter
- ✅ **Progress Page** — Visual day grid, mark days complete, switch between 30/45-day challenge
- ✏️ **Edit/Delete** entries inline
- 🏷️ **Topic system** — Reuse topics with one click
- 🔍 **Search & Filter** — By keyword or topic

---

## 📁 Folder Structure

```
daily-learning-tracker/
├── app/
│   ├── api/
│   │   ├── entries/
│   │   │   ├── route.js          ← GET, POST /api/entries
│   │   │   └── [id]/route.js     ← PUT, DELETE /api/entries/:id
│   │   └── progress/
│   │       └── route.js          ← GET, PUT /api/progress
│   ├── add-entry/
│   │   └── page.js               ← Add Entry page
│   ├── progress-page/
│   │   └── page.js               ← Progress tracker page
│   ├── globals.css
│   ├── layout.js                 ← Root layout
│   └── page.js                   ← Dashboard (home)
├── components/
│   └── Navbar.js
├── lib/
│   ├── mongodb.js                ← DB connection
│   └── models/
│       ├── Entry.js              ← Mongoose schema
│       └── Progress.js           ← Mongoose schema
├── .env.local.example
├── .gitignore
├── jsconfig.json
├── next.config.js
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

---

## 🚀 Local Setup

### 1. Clone / download the project

```bash
git clone <your-repo-url>
cd daily-learning-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MongoDB Atlas (free tier)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free account → Create a **Free Cluster** (M0)
3. Go to **Database Access** → Add a new database user (username + password)
4. Go to **Network Access** → Add IP `0.0.0.0/0` (allow all — required for Vercel)
5. Go to **Clusters** → Click **Connect** → **Connect your application**
6. Copy the connection string — it looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 4. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/learning-tracker?retryWrites=true&w=majority
```

> Replace `username`, `password`, and `cluster0.xxxxx` with your actual values.
> The `/learning-tracker` part is the database name — it will be auto-created.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## ☁️ Vercel Deployment (Step by Step)

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/daily-learning-tracker.git
git push -u origin main
```

### Step 2 — Import on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Select your repository → Click **Import**

### Step 3 — Add Environment Variables

In the Vercel project settings (before deploying):

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/learning-tracker?retryWrites=true&w=majority` |

Click **Add** then **Deploy**

### Step 4 — Done! 🎉

Your app will be live at `https://your-app-name.vercel.app`

---

## 🗄️ Database Schema

### Collection: `entries`
```json
{
  "_id": "ObjectId",
  "day": 1,
  "topic": "JavaScript",
  "subtopic": "Closures",
  "notes": "Learned how closures work with examples",
  "date": "2024-01-15T00:00:00.000Z",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Collection: `progresses`
```json
{
  "_id": "ObjectId",
  "challengeType": 30,
  "completedDays": [1, 2, 3, 5],
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 🔗 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/entries` | Fetch all entries (supports `?search=` and `?topic=`) |
| POST | `/api/entries` | Create new entry |
| PUT | `/api/entries/:id` | Update entry |
| DELETE | `/api/entries/:id` | Delete entry |
| GET | `/api/progress` | Fetch progress (creates default if none) |
| PUT | `/api/progress` | Update challenge type and completed days |

---

## 💡 Tips

- The app is **single-user** — no login needed
- MongoDB Atlas **free tier (M0)** is enough for personal use
- Data persists across sessions — it's stored in the cloud DB
- The `progress-page` shows a visual grid — click any day to toggle it
- Blue cells in the grid = you have an entry for that day; Green = marked complete

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Icons | Lucide React |
| Deployment | Vercel |
