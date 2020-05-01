const express = require('express');
const router = require('express').Router();
const verify = require('../verifytoken');

// GET HOME PAGE
router.get('/', verify, (req, res) => {
    res.render('home');
});

// LOGIN
router.get('/login', (req,res) => {
    res.render('login');
});

// REGISTER
router.get('/register', (req,res) => {
    res.render('register');
});

// PROFILE
router.get('/profile', verify,(req,res) => {
    res.render('profile');
});

// FORGOT PASSWORD
router.get('/change-password', verify, (req,res) => {
    res.render('passchange');
})

// FORGOT PASSWORD
router.get('/forgot', (req,res) => {
    res.render('forgot');
})

// LOGOUT
router.get('/logout', verify, (req,res) => {
    res.clearCookie('authToken').redirect('/login');
})

module.exports = router;