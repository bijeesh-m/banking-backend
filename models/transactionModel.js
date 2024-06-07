const mongoose = require('mongoose')


const transactionSchema = new mongoose.Schema({
    accountNumber: {
      type: String,
      required: true,
    },
    transactionId:{
      type:String,
      default: Date.now()
    },
    transactionType: {
      type: String,
      enum: ['deposit', 'withdrawal'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  });
  
  const transaction = mongoose.model('transaction', transactionSchema);
  module.exports = transaction;