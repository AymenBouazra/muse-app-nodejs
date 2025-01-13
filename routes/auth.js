const express = require('express')
const { googleAuth, login, register, logout } = require('../controllers/auth.controller')
const router = express.Router()

router.post('/google', googleAuth)
router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)

module.exports = router