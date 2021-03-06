// set environment variables
require('dotenv').config();

// import third-party
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// import local file
const { MAX } = require('./src/constant');
const corsConfig = require('./src/configs/cors.config').default;
const accountApi = require('./src/apis/account.api');
const wordApi = require('./src/apis/word.api');
const gameApi = require('./src/apis/game.api');
const flashcardApi = require('./src/apis/flashcard.api');
const commonApi = require('./src/apis/common.api');
const sentenceApi = require('./src/apis/sentence.api');
const blogApi = require('./src/apis/blog.api');
const highscoreApi = require('./src/apis/highscore.api');
const passportConfig = require('./src/middlewares/passport.middleware');

// ================== set port ==================
const app = express();
const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 5000);

const dev = app.get('env') !== 'production';

// ================== Connect mongodb with mongoose ==================
const mongoose = require('mongoose');
const MONGO_URL = dev ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to mongodb');
  })
  .catch((error) => {
    console.log('Error when connecting to mongodb: ', error);
  });

// ================== config ==================
app.use(express.json({ limit: MAX.SIZE_JSON_REQUEST }));
app.use(express.urlencoded({ limit: MAX.SIZE_JSON_REQUEST, extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

// ================== Listening ... ==================
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} !!`);
});

// ================== Apis ==================

app.use(`/account`, accountApi);
app.use(`/word`, wordApi);
app.use(`/games`, gameApi);
app.use(`/flashcard`, flashcardApi);
app.use(`/common`, commonApi);
app.use(`/sentence`, sentenceApi);
app.use(`/blog`, blogApi);
app.use(`/highscore`, passportConfig.jwtAuthentication, highscoreApi);
