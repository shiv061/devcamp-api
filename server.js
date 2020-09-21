const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./db');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const expressRateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

//load env vars
dotenv.config({ path: './config.env' });

// Connect to database

connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload());

//Sanitize Data
app.use(mongoSanitize());

// Set Security Headers
app.use(helmet());

// Clean scripts
app.use(xss());

// Rate limit
const limiter = expressRateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1,
});
app.use(limiter);

//Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routers

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// Handle unhandled rejection

process.on('unhandledRejection', (err, promise) => {
  console.log(`'Error: ${err.message}`.red);
  // Close Server
  server.close(() => process.exit(1));
});
