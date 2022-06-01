const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  fullName: {
    name: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    patronymic: {
      type: String
    },
  },
  address: {
    city: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    home: {
      type: String,
      required: true
    },
    flat: {
      type: String
    },
    intercom: {
      type: String
    },
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: Types.ObjectId,
    ref: 'OrderStatuses'
  },
  comment: {
    type: String,
    default: ''
  },
  order: {
    type: Array,
    required: true
  }
});

module.exports = model('Order', schema);
