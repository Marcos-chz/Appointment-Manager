const express = require('express');
const router = express.Router();

const {
  insertAvailability,
  getAvailability,
  getAvailableSlots
} = require('../controllers/availabilityController');

const { authenticate, authorizeRoles } = require('../middlewares/auth');


router.post(
  '/',
  authenticate,
  authorizeRoles('professional'),
  insertAvailability
);

router.get(
  '/:id',
  authenticate,
  authorizeRoles('client', 'professional'),
  getAvailability
);


router.get(
  '/:professionalId/:date',
  authenticate,
  authorizeRoles('client', 'professional'),
  getAvailableSlots
);

module.exports = router;
