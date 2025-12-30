const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const keywordStr = req.query.keyword ? req.query.keyword : '';

    const keyword = keywordStr
        ? {
            $or: [
                { oemNumber: { $regex: keywordStr, $options: 'i' } },
                { 'name.en': { $regex: keywordStr, $options: 'i' } },
                { 'name.fr': { $regex: keywordStr, $options: 'i' } },
                { 'name.ar': { $regex: keywordStr, $options: 'i' } },
                { 'compatibility.model': { $regex: keywordStr, $options: 'i' } },
                // Check if keyword is numeric for year search
                ...(
                    !isNaN(keywordStr) ? [{ 'compatibility.year': Number(keywordStr) }] : []
                )
            ]
        }
        : {};

    // Filter by category if provided
    if (req.query.category) {
        keyword.category = req.query.category;
    }

    // Filter by Year and Model (YMM Lookups)
    if (req.query.year && req.query.model) {
        // Strict Match: Must match BOTH model and year in the SAME compatibility entry
        keyword.compatibility = {
            $elemMatch: {
                model: req.query.model,
                year: Number(req.query.year)
            }
        };
    } else {
        // Loose Match: Match either criterion independently if only one is present
        if (req.query.year) {
            keyword['compatibility.year'] = Number(req.query.year);
        }
        if (req.query.model) {
            keyword['compatibility.model'] = req.query.model;
        }
    }

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.remove();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const product = new Product({
        name: { en: 'Sample name', fr: 'Nom exemple', ar: 'اسم نموذج' },
        price: 0,
        user: req.user._id,
        images: ['/images/sample.jpg'],
        category: 'Sample category',
        stock: 0,
        oemNumber: 'OEM-' + Date.now(),
        sku: 'SKU-' + Date.now(),
        description: { en: 'Sample description', fr: 'Description exemple', ar: 'وصف نموذج' },
        compatibility: []
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const {
        name,
        price,
        description,
        images,
        category,
        stock,
        oemNumber,
        sku,
        compatibility
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.images = images || product.images;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.oemNumber = oemNumber || product.oemNumber;
        product.sku = sku || product.sku;
        product.compatibility = compatibility || product.compatibility;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
};
