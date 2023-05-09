const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/users.js');
const { signUp, secretRoute, login, getUsers, booking } = require('../controllers/controller.js');

router.post('/sign-up', userMiddleware.validateRegister, signUp);
router.get('/secret-route', secretRoute);
router.get("/getUsers", getUsers);
router.post('/login', login);
router.post('/booking', booking);

module.exports = router;