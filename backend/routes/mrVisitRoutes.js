const express = require('express');
const router = express.Router();
const mrVisitController = require('../controllers/mrVisitController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, mrVisitController.createVisit);
router.get('/', verifyToken, mrVisitController.getVisits);

module.exports = router;
