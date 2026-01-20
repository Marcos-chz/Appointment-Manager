const express = require('express');
const router = express.Router();
const upload = require("../middlewares/uploads");

const {
  getUser,
  getProfessional,
  editPhoto
} = require('../controllers/usersController');

const { authenticate, authorizeRoles } = require('../middlewares/auth');

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/


router.get(
  '/',
  authenticate,
  authorizeRoles('client', 'professional'),
  getUser
);


router.get(
  '/professional',
  authenticate,
  authorizeRoles('client', 'professional'),
  getProfessional
);


router.put(
  '/avatar',
  authenticate,
  authorizeRoles('client', 'professional'),
  upload.single("avatar"),
  editPhoto
);

module.exports = router;
