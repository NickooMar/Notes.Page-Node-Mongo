const express = require('express');
const router = express.Router();         //nos permite crear rutas de servidor

const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',              //Esta autenticacion redirecciona al usuario a distintas pestañas
    failureRedirect: '/users/signin',
    failureFlash: true
}));


router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if(name.length <= 0){
        errors.push({text: 'Please Insert your Name'});
    }
    if(password != confirm_password){
        errors.push({text: 'Password do not match'});
    }
    if(password.length < 4){
        errors.push({text: 'Passwrod must be at least 4 caracters'});
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password}); //Esto envia al usuario a la pagina de register, le dice el error y mantiene los valores
    } else {
        const emailUser = await User.findOne({email: email});
        if(emailUser) {
            req.flash('error_msg', 'email is already takken');  //Mostrara un error si el email es repetido.
            req.redirect('/users/signup');
        }
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password); //Reemplaza la propiedad password del user por el cifrado de la misma.
        await newUser.save();                                        //Asi guardamos el usuario con la contraseña cifrada.
        req.flash('success_msg', 'Youre register'); 
        res.redirect('/users/signin')
}});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;