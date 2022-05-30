const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  id: {
    type: Number,
    default: 0
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  composition: {
    type: Array,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  popularity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
});

module.exports = model('Product', schema);
