const express = require('express');
const router = express.Router();
const passport = require('passport');
const { addToPlaylist, removeFromPlaylist, getPlaylist } = require('../controllers/playlist.controller');

router.post('/add',  passport.authenticate('bearer', { session: false }) , addToPlaylist);
router.put('/remove/:trackId', passport.authenticate('bearer', { session: false }) , removeFromPlaylist);
router.get('/', passport.authenticate('bearer', { session: false }) , getPlaylist);

module.exports = router;