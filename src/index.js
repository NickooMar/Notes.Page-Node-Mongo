const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session  = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const handlebars =  require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');


//initializations
const app = express();
require('./database');
require('./config/passport');  //require el archivo de passport

//Settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir:path.join(app.get('views'), 'layouts'), //Obten la direccion de views y concatenalo con la carpeta layouts
    partialsDir:path.join(app.get('views'), 'partials'),               //partials permite reutilizar el codigo de por ejemplo el head o el footer     //Estas propiedades permiten saber de que manera vamos a utilizar las vistas.
    extname: '.hbs',          //Sirve para colocar que extension tendran los archivos.
    handlebars: allowInsecurePrototypeAccess(handlebars)  
}));
app.set('view engine', '.hbs'); //Configura el motor de plantilla escribiendo la extension.


//Middlewares
app.use(express.urlencoded({extended:false})) //Sirve para que cuando un formulario envie determinado dato yo pueda entenderlo (registro por ejemplo) el false es para no leer imagenes
app.use(methodOverride('_method')); //Sirve para que los formularios envien otros metodos como put, etc
app.use(session({
    secret: process.env.SECRET,
    resave: true,                //A través de estas configuraciones basicas permite a express nos permiten autenticar al usuario y almacenarlo
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Statics files
app.use(express.static(path.join(__dirname, 'public')));

//Server Initialization
app.listen(app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`)
});