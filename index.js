const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

const port = process.env.PORT || 4000;
dotenv.config();
require('./database/connect');
require('./middlewares/passport')

const corsOptions = {
  origin: 'https://muse-app-seven.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://muse-app-seven.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.options('*', cors(corsOptions));



app.use(morgan('dev'))
app.use(express.urlencoded({ limit: '100mb', extended: true }))
app.use(express.json({ limit: '100mb' }))
app.use(bodyParser.json({ limit: 100 * 1024 * 1024 }))
app.use(bodyParser.urlencoded({ limit: 100 * 1024 * 1024, extended: true, parameterLimit: 50000 }))
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(session({ resave: true, secret: process.env.JWT_SECRET, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//** routes */
const auth = require('./routes/auth')
const favoritTracks = require('./routes/playlist')
const user = require('./routes/user')
//** middlewares */
app.use('/api/v1/auth', auth)
app.use('/api/v1/user', user)
app.use('/api/v1/playlist', favoritTracks)

// Test endpoint
app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

app.get('/', (req, res) => {
  res.send('Hello world')
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});