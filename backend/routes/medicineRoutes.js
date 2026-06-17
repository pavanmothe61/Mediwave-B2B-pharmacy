const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, medicineController.getMedicines);
router.post('/', verifyToken, isAdmin, medicineController.createMedicine);
router.put('/:id', verifyToken, isAdmin, medicineController.updateMedicine);

module.exports = router;
