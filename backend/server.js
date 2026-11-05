const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Load env vars (.env first, .env.example as fallback for missing keys)
require('./config/env');

// Connect to Database
connectDB();

const app = express();

app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS — native apps send no Origin header and are always allowed;
// browser origins must be listed in CORS_ORIGINS (comma separated).
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(compression()); // gzip JSON — big win on slow mobile networks
app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('NOT_ALLOWED_BY_CORS'));
    },
  })
);

// Rate limiting — auth endpoints get headroom for OTP flows
// (fine-grained per-account OTP caps live in utils/otp.js)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again later.' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please slow down.' },
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('MPS API is running...');
});

// Define Routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/downloads', require('./routes/downloadRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/events', apiLimiter, require('./routes/eventRoutes'));
app.use('/api/notices', apiLimiter, require('./routes/noticeRoutes'));
app.use('/api/faculty', apiLimiter, require('./routes/facultyRoutes'));
app.use('/api/gallery', apiLimiter, require('./routes/galleryRoutes'));
app.use('/api/banners', apiLimiter, require('./routes/bannerRoutes'));
app.use('/api/content', apiLimiter, require('./routes/contentRoutes'));
app.use('/api/settings', apiLimiter, require('./routes/settingsRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error.message === 'NOT_ALLOWED_BY_CORS') {
    return res.status(403).json({ message: 'Origin not allowed' });
  }
  if (error.message === 'INVALID_FILE_TYPE') {
    return res
      .status(400)
      .json({ message: 'Only images (jpg, jpeg, png, gif, webp) and PDF files are accepted.' });
  }
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File too large. Maximum size is 10MB.' });
  }
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
