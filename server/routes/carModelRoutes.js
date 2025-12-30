const express = require('express');
const router = express.Router();
const {
    getCarModels,
    createCarModel,
    deleteCarModel,
} = require('../controllers/carModelController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCarModels)
    .post(protect, admin, createCarModel);

router.route('/:id')
    .delete(protect, admin, deleteCarModel);

module.exports = router;
