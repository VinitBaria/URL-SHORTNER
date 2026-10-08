const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true
  },
  orgurl: {
    type: String,
    required: true,
  },
  visitedhistory: [{
    type: Date,
    default: Date.now,
  }],
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
