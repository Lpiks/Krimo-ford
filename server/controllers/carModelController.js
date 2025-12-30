const CarModel = require('../models/CarModel');

// @desc    Get all car models
// @route   GET /api/carmodels
// @access  Public
const getCarModels = async (req, res) => {
    const carModels = await CarModel.find({}).sort({ name: 1 });
    res.json(carModels);
};

// @desc    Create a car model
// @route   POST /api/carmodels
// @access  Private/Admin
const createCarModel = async (req, res) => {
    const { name } = req.body;

    const carModelExists = await CarModel.findOne({ name });

    if (carModelExists) {
        res.status(400);
        throw new Error('Car model already exists');
    }

    const carModel = await CarModel.create({ name });

    if (carModel) {
        res.status(201).json(carModel);
    } else {
        res.status(400);
        throw new Error('Invalid car model data');
    }
};

// @desc    Delete a car model
// @route   DELETE /api/carmodels/:id
// @access  Private/Admin
const deleteCarModel = async (req, res) => {
    try {
        console.log(`Attempting to delete CarModel ID: ${req.params.id}`);
        const carModel = await CarModel.findById(req.params.id);

        if (carModel) {
            await carModel.deleteOne();
            console.log('CarModel deleted successfully');
            res.json({ message: 'Car model removed' });
        } else {
            console.log('CarModel not found in DB');
            res.status(404);
            throw new Error('Car model not found');
        }
    } catch (error) {
        console.error('Error in deleteCarModel:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete multiple car models
// @route   POST /api/carmodels/bulk-delete
// @access  Private/Admin
const deleteCarModels = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400);
            throw new Error('No IDs provided');
        }

        await CarModel.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Car models deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCarModels,
    createCarModel,
    deleteCarModel,
    deleteCarModels,
};
