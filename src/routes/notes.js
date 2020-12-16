const express = require('express');
const router = express.Router();         //nos permite crear rutas de servidor

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth')


router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated,async (req, res) => {
    //console.log(req.body); El req.body permite ver como esta compuesta lo que recibe del formulario.
    const { title, description } = req.body;
    const errors = [];
    if(!title) {
        errors.push({text:'Please write a title'});
    }
    if(!description) {
        errors.push({text:'Please Write a description'});
    }
    if(errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({title, description});
        newNote.user = req.user.id; // La propiedad user es igual al request.user.id, al momento que se autentica al usuario se guarda en request user
        //guarda todos los datos del usuario pero yo solo necesito el id
        await newNote.save();       //proceso asincrono
        req.flash('success_msg', 'Note added successfully');
        res.redirect('/notes');        
    }
}); //Recibe los datos que se ingresan en el formulario de new-note por eso usa el metodo post (ver new-note.hbs)

router.get('/notes', isAuthenticated,async (req, res) => {
    await Note.find({user: req.user.id}).sort({date:'desc'}) //Esto hace que se muestren solo las notas del usuario unicamente Note.find({user: req.user.id})
        .then(documentos => {
            const contexto = {
                notes: documentos.map(documento => {
                    return {
                        _id: documento.id,
                        title:documento.title,
                        description:documento.description
                    }
                })
            }
            res.render('notes/all-notes', { notes: contexto.notes}); //renderiza desde note,all-notes y le pasa los datos de las notas { notes }
        })
});


router.get('/notes/edit/:id', isAuthenticated,async (req, res) => {

    const note = await Note.findById(req.params.id)
    .then(data =>{      
        return {
            title:data.title,
            description:data.description,
            id:data.id
        }
    })
    res.render('notes/edit-note',{note})
});

router.put('/notes/edit-note/:id', isAuthenticated,async(req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description});
    req.flash('success_msg', 'Note Updated successfully');
    res.redirect('/notes');
})

router.delete('/notes/delete/:id', isAuthenticated,async (req, res) => { 
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Successfully');
    res.redirect('/notes');
});


module.exports = router;