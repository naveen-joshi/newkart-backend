const asyncHandler = require('express-async-handler');
const Product = require('../model/productModel')
// @desc Get Products
// @route GET /api/products
// @access private
const getProducts = asyncHandler(async(req, res) => {
    const products = await Product.find()
    res.status(200).json(products);
})

// @desc Post Products
// @route Post /api/products
// @access private
const addProduct = asyncHandler(async(req, res) => {
    if(!req.body.prodName) {
        res.status(400);
        throw new Error('Please Add Details');
    }
    const newProduct = await Product.create({
        prodName: req.body.prodName
    })
    res.status(200).json(newProduct);
})

// @desc Update Products
// @route Update /api/products/:id
// @access private
const updateProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)

    if(!product) {
        res.status(400);
        throw new Error('Product not found')
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updatedProduct)
})

// @desc Delete Products
// @route DELETE /api/products/:id
// @access private
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if(!product) {
        res.status(400)
        throw new Error('Product not found')
    }

    await product.remove()
    res.status(200).json({ id: req.params.id})
})

module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
}