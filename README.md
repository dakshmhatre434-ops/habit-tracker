# 🚀 Habit Tracker API

> A production-style Node.js + Express API for tracking daily habits with weekly analytics, streaks, and completion insights.

---

## ✨ Features

- **Create & Manage Habits** — Flexible habit creation with no predefined limits
- **Daily Logging** — Mark habits as `done` or `not done` per day
- **Weekly Analytics** — Last 7 days breakdown with:
  - Completion percentage
  - Current streak (consecutive days ending today)
  - Longest streak within the week
- **Request Logging** — Every request logged with method, path, status, and duration
- **Centralized Error Handling** — Consistent JSON error responses
- **Input Validation** — Strict validation on all inputs
- **Self-Documenting API** — Root endpoint lists all available routes

---

## 📁 Folder Structure

```
habit-tracker-api/
├── src/
│   ├── controllers/
│   │   └── habitController.js      # Thin controllers (req/res only)
│   ├── middleware/
│   │   ├── errorHandler.js        # Global error handler
│   │   └── requestLogger.js       # Request logging
│   ├── services/
│   │   └── habitService.js         # Business logic & in-memory storage
│   ├── utils/
│   │   ├── analytics.js            # Weekly analytics calculations
│   │   └── validation.js           # Input validation helpers
│   └── index.js                    # Server entry point
├── .env.example                     # Environment variables template
├── package.json
└── README.md
```

---

## 🛠️ Installation

```bash
git clone <repo-url>
cd habit-tracker-api
npm install
```

Copy the environment template:

```bash
cp .env.example .env
```

Edit `.env` if needed:

```env
PORT=3000
NODE_ENV=development
```

---

## ▶️ Running Locally

```bash
npm start
# or
npm run dev
```

Server runs at **http://localhost:3000**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check with uptime |
| GET | `/api/v1` | API info & endpoint list |
| POST | `/api/v1/habits` | Create a new habit |
| GET | `/api/v1/habits` | List all habits |
| GET | `/api/v1/habits/:id` | Get habit by ID |
| POST | `/api/v1/habits/:id/log` | Log daily status |
| GET | `/api/v1/habits/:id/weekly` | Weekly analytics |

---

## 📋 Sample Requests & Responses

### Health Check

```bash
curl http://localhost:3000/health
```

```json
{
  "success": true,
  "status": "OK",
  "uptime": "42.50s",
  "timestamp": "2026-06-18T10:45:00.000Z",
  "environment": "development"
}
```

### API Info

```bash
curl http://localhost:3000/api/v1
```

```json
{
  "success": true,
  "name": "Habit Tracker API",
  "version": "1.0.0",
  "description": "A flexible habit tracking system with weekly analytics",
  "endpoints": {
    "health": "GET /health",
    "createHabit": "POST /api/v1/habits",
    "getAllHabits": "GET /api/v1/habits",
    "getHabit": "GET /api/v1/habits/:id",
    "logHabit": "POST /api/v1/habits/:id/log",
    "weeklyAnalytics": "GET /api/v1/habits/:id/weekly"
  }
}
```

### Create Habit

```bash
curl -X POST http://localhost:3000/api/v1/habits \
  -H "Content-Type: application/json" \
  -d '{"name": "Gym"}'
```

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "Gym",
    "createdAt": "2026-06-18",
    "logs": []
  }
}
```

### Log Daily Status

```bash
curl -X POST http://localhost:3000/api/v1/habits/abc123/log \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-06-18", "status": "done"}'
```

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "Gym",
    "logs": [
      { "date": "2026-06-18", "status": "done" }
    ]
  }
}
```

### Weekly Analytics

```bash
curl http://localhost:3000/api/v1/habits/abc123/weekly
```

```json
{
  "success": true,
  "data": {
    "habitId": "abc123",
    "habitName": "Gym",
    "week": [
      { "date": "2026-06-12", "status": "not done" },
      { "date": "2026-06-13", "status": "done" },
      { "date": "2026-06-14", "status": "done" },
      { "date": "2026-06-15", "status": "not done" },
      { "date": "2026-06-16", "status": "done" },
      { "date": "2026-06-17", "status": "done" },
      { "date": "2026-06-18", "status": "done" }
    ],
    "completedDays": 5,
    "missedDays": 2,
    "completionPercentage": 71.43,
    "currentStreak": 3,
    "longestStreak": 3
  }
}
```

---

## ✅ Validation Rules

| Field | Rules |
|-------|-------|
| `name` | Required, string, 2–50 characters |
| `date` | Required, format `YYYY-MM-DD`, valid calendar date |
| `status` | Required, must be `"done"` or `"not done"` |

---

## ❌ Error Responses

All errors follow this structure:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

| HTTP Status | Scenario |
|-------------|----------|
| 400 | Invalid input (validation failure) |
| 404 | Habit not found |
| 500 | Unexpected server error |

---

## 📊 Analytics Calculation

- **Week Window**: Last 7 calendar days (including today)
- **Missing Dates**: Treated as `"not done"`
- **Completion %**: `(completedDays / 7) × 100`
- **Current Streak**: Consecutive `"done"` days counting backwards from today
- **Longest Streak**: Maximum consecutive `"done"` days within the 7-day window

---

## 🔮 Future Improvements

- Persistent storage (MongoDB / PostgreSQL)
- User authentication & multi-user support
- Monthly / yearly analytics
- Habit categories & tags
- Daily reminder notifications
- Export data to CSV / JSON

---

## 📄 License

MIT
