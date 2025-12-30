const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    oemNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    sku: {
        type: String,
        unique: true,
        index: true
    },
    name: {
        en: { type: String, required: true },
        fr: { type: String, required: true },
        ar: { type: String, required: true }
    },
    description: {
        en: { type: String },
        fr: { type: String },
        ar: { type: String }
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    compatibility: [{
        year: { type: Number },
        model: { type: String },
        make: { type: String, default: 'Ford' }
    }],
    images: [{
        type: String
    }],
    fuelType: {
        type: String,
        enum: ['Essence', 'Diesel'],
        default: 'Essence'
    },
    isFeatured: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
