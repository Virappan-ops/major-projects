const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); 
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use('/api/users', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/events', eventRoutes); 
app.use('/api/analytics', analyticsRoutes);

app.get('/api-status', (req, res) => {
  res.send('Ionix API is running 🚀');
});

// ----------------------------------------------------
// ✅ THE REFRESH FIX (Regex Version)
// ----------------------------------------------------

const __dirname1 = path.resolve();
const frontendPath = path.join(__dirname1, '../frontend/dist');

// Serve static files from the React frontend app
app.use(express.static(frontendPath));

// ⭐ UPDATED: Using Regex /.*/ avoids "Missing parameter name" errors
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(frontendPath, 'index.html'));
});

// ----------------------------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n⚡ Ionix Backend running on port ${PORT}`);
});