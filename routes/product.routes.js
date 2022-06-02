const { Router } = require('express');
const router = Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const {check} = require("express-validator");

router.get('/', async (req, res) =>
  {
    try {
      const products = await Product.find();

      if(!products) {
        return res.status(400).json({ message: 'Продуктов не найдено!' });
      }

      res.json(products);
    }
    catch (e) {
      res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
    }
});

router.post('/create', auth, [
  check('name', 'Минимальная длина названия продукта 6 символов').isLength({ min: 6 }),
  check('category', 'Укажите категорию').isLength({ min: 1 }),
  check('price', 'Укажите цену').isLength({ min: 1 }),
], async (req, res) =>
  {
    try {
      const productExist = await Product.findOne({ name: req.body.name });

      if(productExist) {
        return res.status(500).json({ message: `Продукт ${ req.body.name } - существует.` })
      }

      const product = new Product(req.body);

      await product.save();
      res.status(201).json({ message: 'Продукт успешно создан!' })
    }
    catch (e) {
      res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
    }
});

router.put('/:id/update', async (req, res) =>
  {
    try {
      const productExist = await Product.findOne({ _id: req.params.id });

      if(!productExist) {
        return res.status(500).json({ message: `Продукт не найден.` })
      }

      const asd = await Product.findOneAndUpdate({ _id: req.params.id }, {...req.body})

      res.status(201).json({ message: 'Продукт успешно обновлен!' })
    }
    catch (e) {
      res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
    }
});

router.delete('/:id/delete', async (req, res) =>
{
  try {
    const productExist = await Product.findOne({ _id: req.params.id });

    if(!productExist) {
      return res.status(500).json({ message: `Продукт не найден.` })
    }

    await Product.findByIdAndRemove({ _id: req.params.id }).exec();
    res.status(201).json({ message: 'Продукт успешно удален!' });
  }
  catch (e) {
    res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
  }
});

module.exports = router;