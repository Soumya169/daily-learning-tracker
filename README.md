# 📚 LearnTracker - Advanced Learning Management Platform

A comprehensive, modern web platform to track your learning journey — built with Next.js 14 (App Router), Tailwind CSS, and MongoDB Atlas.

---

## ✨ Features

### 🎯 **Core Tracking**
- 📊 **Dashboard** — Comprehensive stats: days completed, current streak, challenge progress, time tracking
- ➕ **Add Entry** — Log day, topic, subtopic, notes, time spent, difficulty, mood, and tags
- 📋 **View Entries** — Sorted day-wise with advanced search + topic/tag filters
- ✅ **Progress Page** — Visual day grid, mark days complete, switch between challenges
- ✏️ **Edit/Delete** entries inline with full field support

### 📈 **Advanced Analytics**
- 📊 **Analytics Dashboard** — Detailed insights into learning patterns, time spent, and productivity
- 📈 **Progress Visualization** — Beautiful charts and graphs for learning journey
- 🎯 **Goal Tracking** — Set and monitor multiple learning goals with deadlines
- 📊 **Performance Metrics** — Track difficulty levels, learning mood, and topic distribution

### 🎯 **Goal Management**
- 🎯 **Multiple Goals** — Create and track unlimited learning challenges
- 📅 **Deadline Tracking** — Set start/end dates for goals
- 🏷️ **Categorization** — Organize goals by category and priority
- 📊 **Progress Monitoring** — Visual progress bars and completion tracking

### 🏷️ **Organization**
- 🏷️ **Topic System** — Reuse topics with one-click selection
- 🏷️ **Tagging** — Add custom tags to entries for better organization
- 🔍 **Advanced Search** — Filter by topic, subtopic, tags, difficulty, and mood
- 📊 **Time Tracking** — Log and analyze time spent on learning activities

### 🎨 **User Experience**
- 🌙 **Modern UI** — Clean, responsive design with dark theme
- 📱 **Mobile-First** — Optimized for all devices
- ⚡ **Fast Performance** — Built with Next.js 14 for optimal speed
- 🎯 **Intuitive Navigation** — Easy access to all features

---

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd daily-learning-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   Add your MongoDB connection string to `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

---

## 📁 **Project Structure**

```
daily-learning-tracker/
├── app/
│   ├── analytics/           ← Analytics dashboard
│   ├── api/
│   │   ├── entries/         ← Entry CRUD operations
│   │   ├── goals/           ← Goal management
│   │   └── progress/        ← Progress tracking
│   ├── dashboard/           ← Main dashboard
│   ├── goals/               ← Goals management page
│   ├── add-entry/           ← Add new entry page
│   ├── progress-page/       ← Progress visualization
│   ├── globals.css
│   ├── layout.js            ← Root layout
│   └── page.js              ← Landing page
├── components/
│   └── Navbar.js            ← Navigation component
├── lib/
│   ├── mongodb.js           ← Database connection
│   └── models/
│       ├── Entry.js         ← Entry data model
│       ├── Goal.js          ← Goal data model
│       └── Progress.js      ← Progress data model
├── .env.local.example
├── package.json
├── tailwind.config.js
└── next.config.js
```

---

## 🗄️ **Data Models**

### Entry Model
```javascript
{
  day: Number,           // Challenge day number
  topic: String,         // Main learning topic
  subtopic: String,      // Specific subtopic
  notes: String,         // Learning notes
  timeSpent: Number,     // Time in minutes
  difficulty: String,    // easy/medium/hard
  mood: String,          // frustrated/neutral/satisfied/excited
  tags: [String],        // Custom tags
  date: Date            // Entry date
}
```

### Goal Model
```javascript
{
  title: String,         // Goal title
  description: String,   // Goal description
  targetDays: Number,    // Total days for goal
  completedDays: [Number], // Completed day numbers
  startDate: Date,       // Goal start date
  endDate: Date,         // Goal end date (optional)
  status: String,        // active/completed/paused
  category: String,      // Goal category
  priority: String       // low/medium/high
}
```

---

## 🎯 **Usage Guide**

### Creating Your First Entry
1. Navigate to "Add Entry" from the navigation
2. Fill in the day number, topic, and notes
3. Add time spent, difficulty level, and mood
4. Tag your entry with relevant keywords
5. Save to track your progress

### Setting Learning Goals
1. Go to the "Goals" page
2. Click "New Goal" to create a challenge
3. Set title, target days, and deadline
4. Categorize and prioritize your goal
5. Track daily progress by marking completed days

### Analyzing Your Progress
1. Visit the "Analytics" page for detailed insights
2. View time spent, topic distribution, and mood patterns
3. Monitor streaks and productivity trends
4. Use data to optimize your learning strategy

---

## 🔧 **API Endpoints**

### Entries
- `GET /api/entries` — Get all entries
- `POST /api/entries` — Create new entry
- `PUT /api/entries/:id` — Update entry
- `DELETE /api/entries/:id` — Delete entry

### Goals
- `GET /api/goals` — Get all goals
- `POST /api/goals` — Create new goal
- `PUT /api/goals/:id` — Update goal
- `DELETE /api/goals/:id` — Delete goal

### Progress
- `GET /api/progress` — Get progress data
- `PUT /api/progress` — Update progress

---

## 🚀 **Deployment**

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- Self-hosted with Docker

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 **Support**

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join our community discussions

---

**Happy Learning! 🎓**
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
