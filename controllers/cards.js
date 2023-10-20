const mongoose = require('mongoose');

const Card = require('../models/card');

const errors = require('../errors/errors');

// const ERROR_CODE_VALIDATION = 400;

// const ERROR_CODE_NOT_FOUND = 404;

// const ERROR_CODE_SERVER = 500;

// const STATUS_CODE_OBJECT_CREATED = 201;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(errors.INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(errors.OK).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(errors.INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(errors.BAD_REQUEST).send({ message: 'Некорректный формат id карточки' });
  }
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(errors.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.status(errors.OK).send({ message: 'Карточка успешно удалена', card });
    })
    .catch((err) => {
      res.status(errors.INTERNAL_SERVER_ERROR).send({ message: `Ошибка при удалении карточки: ${err}` });
    });

  return null;
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => {
      if (!card) {
        return res.status(errors.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }

      return res.status(errors.OK).send(card);
    })
    .catch((err) => {
      res.status(errors.BAD_REQUEST).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => {
      if (!card) {
        return res.status(errors.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }

      return res.status(errors.OK).send(card);
    })
    .catch((err) => {
      res.status(errors.BAD_REQUEST).send({ message: err.message });
    });
};
