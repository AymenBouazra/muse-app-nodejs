const express = require('express')
const { editProfile, getUser } = require('../controllers/user.controller')
const upload = require('../middlewares/multer')
const router = express.Router()
const passport = require('passport')

router.put('/edit-profile/:id', [ passport.authenticate('bearer', { session: false }), upload.single('picture'), editProfile])
router.get('/get-user/:id', getUser)

module.exports = router