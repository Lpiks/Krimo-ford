const express = require('express');
const router = express.Router();
const {
    getCarModels,
    createCarModel,
    deleteCarModel,
    deleteCarModels,
} = require('../controllers/carModelController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCarModels)
    .post(protect, admin, createCarModel);

router.route('/bulk-delete').post(protect, admin, deleteCarModels);

router.route('/:id')
    .delete(protect, admin, deleteCarModel);

module.exports = router;
