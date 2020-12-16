const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt) //Toma la contraseña y el algoritmo para hashear la contraseña
    return hash;
};

UserSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password); //retorna la comparacion de la contraseña que da el usuario con la contraseña del modelo de datos.
};



module.exports = mongoose.model('User', UserSchema) //Le pasamos dos valores Userschema y el User