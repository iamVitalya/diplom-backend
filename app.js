require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*")
// })

app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/product', require('./routes/product.routes'));
app.use('/api/user', require('./routes/user.routes'));

async function start() {
  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    app.listen(PORT, () => console.log(`Твое приложение на порту ${PORT}`))
  }
  catch (e) {
    console.error('Ошибка подключения к БД', e.message);
    process.exit(1);
  }
}

start();