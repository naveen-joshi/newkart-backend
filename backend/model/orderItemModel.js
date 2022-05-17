const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.objectId,
        ref: 'Product'
    }
})

module.exports = mongoose.model('OrderItem', orderItemSchema)