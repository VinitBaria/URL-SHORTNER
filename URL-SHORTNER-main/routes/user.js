const express = require('express');
const router = express.Router();
const { createUser, findUserByEmailAndPassword } = require('../controller/user');

router.get('/signup', (req, res) => {
    res.render('signup');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/signup', createUser);
router.post('/login', findUserByEmailAndPassword);


module.exports = router;