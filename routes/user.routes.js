const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// api/user
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find();

    if(!users) {
      return res.status(400).json({ message: 'Пользовательей не найдено!' });
    }

    res.json(users);
  }
  catch (e) {
    res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
  }
});

// api/user
router.delete('/:id/delete', auth, async (req, res) => {
  try {
    const userExist = await User.findOne({ id: req.params.id });

    if(!userExist) {
      return res.status(500).json({ message: `Пользователь не найден.` })
    }

    await User.findByIdAndRemove({ _id: req.params.id }).exec();
    res.status(201).json({ message: 'Пользователь успешно удален!' });
  }
  catch (e) {
    res.status(500).json({ message: 'Что -то пошло не так, попробуйте позже.', errorMessage: e.message })
  }
});

module.exports = router;