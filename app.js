const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validationLogin, validationCreateUser } = require('./validation/validation');

const handleErrors = require('./middlewares/handleErrors');

const app = express();
const { PORT = 3000 } = process.env;
const routes = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(express.json());
app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);
app.use(auth); // защита всех роутеров авторизацией
app.use(routes);
app.use(errors()); // обработчик ошибок celebrate
app.use(handleErrors); // центральный обработчик ошибок

app.listen(PORT);
