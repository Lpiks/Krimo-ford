const mongoose = require('mongoose');

const carModelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CarModel', carModelSchema);
