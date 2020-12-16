const express = require('express');
const router = express.Router();         //nos permite crear rutas de servidor

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;