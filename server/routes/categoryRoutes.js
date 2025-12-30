const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    deleteCategory,
    deleteCategories,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCategories)
    .post(protect, admin, createCategory);

router.route('/bulk-delete').post(protect, admin, deleteCategories);

router.route('/:id')
    .delete(protect, admin, deleteCategory);

module.exports = router;
