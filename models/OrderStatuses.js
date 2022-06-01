const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  owner: {
    type: Types.ObjectId,
    ref: 'Order'
  },
  name: {
    type: String,
    required: true
  }
});

module.exports = model('OrderStatuses', schema);
