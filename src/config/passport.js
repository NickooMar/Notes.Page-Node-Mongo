const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User'); 

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  // Match Email's User
  const user = await User.findOne({email: email});
  if (!user) {
    return done(null, false, { message: 'Not User found.' });
  } else {
    // Match Password's User
    const match = await user.matchPassword(password);
    if(match) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect Password.' });
    }
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);                     //Permite que el usuario no se tenga que logear siempre que entra a una pestaña
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {       //si hay un usuario en la  sesion busca por id al usuario, y en la busqueda puede obtener un error o un usuario
    done(err, user);
  });
});