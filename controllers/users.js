const { NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR } = require('../errors/errors');
const User = require('../models/user');

const INVALID_USER_ID_ERROR = 'Некорректный идентификатор пользователя';
const INTERNAL_SERVER_ERROR_MESSAGE = 'Внутренняя ошибка сервера';

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
      console.log(`Произошла ошибка: ${err.name} ${err.message}`);
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: INVALID_USER_ID_ERROR });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
      }
    });
};
