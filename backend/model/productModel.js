const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    prodName: {
        type: String,
        required: [true, 'Please add name']
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("Product", productSchema)