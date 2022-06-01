const { Router } = require('express');
const router = Router();
const Order = require('../models/Order');
const Statuses = require('../models/OrderStatuses');
const auth = require('../middleware/auth');
const { check, validationResult} = require("express-validator");

// Заказы
router.get('/', auth, async (req, res) => {
    try {
      const orders = await Order.find();

      if(!orders) {
        return res.status(400).json({ message: 'Заказов не найдено!' });
      }

      res.json(orders);
    }
    catch (e) {
      res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
    }
});

router.post('/create', [
  check('fullName.name', "Поле 'Имя' не заполнено").not().isEmpty(),
  check('fullName.lastname', "Поле 'Фамилия' не заполнено").not().isEmpty(),
  check('address.city', "Поле 'Город' не заполнено").not().isEmpty(),
  check('address.street', "Поле 'Улица' не заполнено").not().isEmpty(),
  check('address.home', "Поле 'Дом' не заполнено").not().isEmpty(),
  check('phone', "Поле 'Телефон' не заполнено").not().isEmpty(),
], async (req, res) => {
    try {
      const errors = validationResult(req);

      if(!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Некорректные данные при заказе',
          errors: errors.array()
        })
      }

      console.log(req.body)

      const order = new Order(req.body);

      await order.save();
      res.status(201).json({ message: 'Заказ успешно создан!' })
    }
    catch (e) {
      res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
    }
});

router.put('/:id/update', auth, async (req, res) => {
    try {
      const orderExist = await Order.findOne({ _id: req.params.id });

      console.log('req.body - update', req.body)

      if(!orderExist) {
        return res.status(500).json({ message: `Заказ не найден.` })
      }

      await Order.findOneAndUpdate({ _id: req.params.id }, {...req.body})

      res.status(201).json({ message: 'Заказ успешно обновлен!' })
    }
    catch (e) {
      res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
    }
});

router.delete('/:id/delete', auth, async (req, res) => {
  try {
    const orderExist = await Order.findOne({ _id: req.params.id });

    if(!orderExist) {
      return res.status(500).json({ message: `Заказ не найден.` })
    }

    await Order.findByIdAndRemove({ _id: req.params.id }).exec();
    res.status(201).json({ message: 'Заказ успешно удален!' });
  }
  catch (e) {
    res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
  }
});


// Статусы заказа
router.get('/statuses', auth, async (req, res) => {
  try {
    const statuses = await Statuses.find();

    if(!statuses) {
      return res.status(400).json({ message: 'Статусов не найдено!' });
    }

    res.json(statuses);
  }
  catch (e) {
    res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
  }
});

// router.post('/statuses/create', auth, async (req, res) => {
router.post('/statuses/create', async (req, res) => {
  try {
    const status = new Statuses(req.body);

    console.log(req.body)

    await status.save();
    res.status(201).json({ message: 'Статус успешно создан!' })
  }
  catch (e) {
    res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
  }
});

module.exports = router;