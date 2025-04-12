const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const userController = require('../controllers/userController');


// Profile route
router.get('/profile', authenticate, userController.getProfile);
// Admin routes
router.get('/', authenticate, authorize('admin'), userController.getUsers);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

// User-specific routes
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userController.updateUser);



module.exports = router;