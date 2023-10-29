const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { validationCreateCard, validationCardId } = require('../validation/validation');

// возвращает все карточки
router.get('/', getCards);
// создает карточку
router.post('/', validationCreateCard, createCard);
// удаляет карточку по идентификатору
router.delete('/:cardId', validationCardId, deleteCard);
// ставит лайк карточке
router.put('/:cardId/likes', validationCardId, likeCard);
// убирает лайк с карточки
router.delete('/:cardId/likes', validationCardId, dislikeCard);

module.exports = router;
