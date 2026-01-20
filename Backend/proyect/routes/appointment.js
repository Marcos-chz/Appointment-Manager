const express = require('express');
const router = express.Router();

const {
  newAppointment,
  getAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointmentByPro,
  updateAppointment,
  changeStatus,
} = require('../controllers/appointmentController');

const { authenticate, authorizeRoles } = require('../middlewares/auth');

// CLIENT
router.get(
  '/',
  authenticate,
  authorizeRoles('client'),
  getAppointment
);

router.post(
  '/',
  authenticate,
  authorizeRoles('client'),
  newAppointment
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('client'),
  updateAppointment
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('client'),
  deleteAppointment
);

// PROFESSIONAL
router.get(
  '/professional',
  authenticate,
  authorizeRoles('professional'),
  getAppointmentByPro
);

router.put(
  '/:id/status',
  authenticate,
  authorizeRoles('professional'),
  changeStatus
);

// SHARED (client o professional)
router.get(
  '/:id',
  authenticate,
  authorizeRoles('client', 'professional'),
  getAppointmentById
);

module.exports = router;
