require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');
const habitController = require('./controllers/habitController');

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    uptime: `${process.uptime().toFixed(2)}s`,
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// API info
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Habit Tracker API',
    version: '1.0.0',
    description: 'A flexible habit tracking system with weekly analytics',
    environment: NODE_ENV,
    endpoints: {
      health: 'GET /health',
      createHabit: 'POST /api/v1/habits',
      getAllHabits: 'GET /api/v1/habits',
      getHabit: 'GET /api/v1/habits/:id',
      logHabit: 'POST /api/v1/habits/:id/log',
      weeklyAnalytics: 'GET /api/v1/habits/:id/weekly',
    },
  });
});

// API v1 routes
app.post('/api/v1/habits', habitController.createHabit);
app.get('/api/v1/habits', habitController.getAllHabits);
app.get('/api/v1/habits/:id', habitController.getHabitById);
app.put('/api/v1/habits/:id', habitController.updateHabit);
app.delete('/api/v1/habits/:id', habitController.deleteHabit);
app.post('/api/v1/habits/:id/log', habitController.logHabitStatus);
app.get('/api/v1/habits/:id/weekly', habitController.getWeeklyAnalytics);

app.use(errorHandler);

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Habit Tracker API running on http://localhost:${PORT} (${NODE_ENV})`);
});
