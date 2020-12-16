const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost/${process.env.MONGODB}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})  //Connect permite conectarme a una direccion de internet, en este caso es en la maquina local
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));