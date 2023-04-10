const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/', emailController.enviarEmail);

module.exports = router;