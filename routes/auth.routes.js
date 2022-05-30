const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Types} = require("mongoose");

// api/auth/register
router.post(
  '/register',
  auth,
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
  ],
  async (req, res) =>
  {
    try {
      const errors = validationResult(req);

      if(!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Некорректные данные при регистрации',
          errors: errors.array()
        })
      }

      const { email, password, isAdmin } = req.body;
      const candidate = await User.findOne({ email });

      if(candidate) {
        return res.status(500).json({ message: 'Пользователь существует.' })
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const roles = isAdmin ? ['admin'] : ['personal'];
      const user = new User({ email, password: hashedPassword, roles });

      await user.save();
      res.status(201).json({ message: 'Пользователь успешно создан!' })
    }
    catch (e) {
      res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
    }
});

// api/auth/login
router.post('/login',
  [
    // check('login', 'Некорректные логин или пароль').exists(),
    check('email', 'Некорректный email').normalizeEmail().isEmail(),
    check('password', 'Некорректные логин или пароль').exists(),
  ],
  async (req, res) =>
  {
    try {
      const errors = validationResult(req);

      if(!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Некорректные данные при регистрации',
          errors: errors.array()
        })
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if(!user) {
        return res.status(400).json({ message: 'Пользователь не найден!' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        return res.status(400).json({ message: 'Неверный логин или пароль, попробуйте снова.' });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.SECRET_KEY,
        { expiresIn: '12h' }
      )

      res.json({ token, userId: user.id });
    }
    catch (e) {
      res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
    }
  });

module.exports = router;