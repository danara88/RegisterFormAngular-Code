const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');

const controller = {

    // registrar el usuario
    register: (req, res) => {
        
        const params = req.body;
        const user = new User();
        user.name = params.name;
        user.surname = params.surname;
        user.nickname = params.nickname;
        user.email = params.email;
        user.password = params.password;

        if( user.name !== null && user.surname !== null && user.email !== null && user.password !== null ) {
            bcrypt.hash(user.password, null, null, (err, hash) => {
                user.password = hash;
                
               user.save((err, userStored) => {
                if(err) return res.status(500).send({ message: 'Internal sserver error: 500' });
                if(!userStored) return res.status(400).send({ message: 'Something went wrong. Try again.' });
                return res.status(200).send({ user: userStored });
               });
            });
        } else {
            return res.status(400).send({ message: 'Complete all the fields.' });
        }

    },

    // comprobar que el nombre de usuario no este repetido
    noRepeatedNickname: (req, res) => {
        const nickname = req.params.nickname;

        User.find({nickname }, (err, users) => {
            if(err) return res.status(500).send({ message: 'Internal sserver error: 500' });
            if(!users) return res.status(400).send({ message: 'Something went wrong. Try again.' });

            // si hay resultados con ese nombre de usuario significa que ya ha sido tomado por alguien más
            if(users.length > 0) return res.status(400).send({ message: nickname + ' has been taken.' });
            
            // si todo va bien, que me devuelva el nombre de usuario
            return res.status(200).send({ nickname });
        });
    },

    // comprobar que el correo no haya sido tomado aún
    noRepeatedEmail: (req, res) => {
        const email = req.params.email;

        User.find({ email }, (err, users) => {
            if(err) return res.status(500).send({ message: 'Internal sserver error: 500' });
            if(!users) return res.status(400).send({ message: 'Something went wrong. Try again.' });

            // si hay resultados con ese correo significa que ya ha sido tomado por alguien más
            if(users.length > 0) return res.status(400).send({ message: email + ' has been registered.' });
            
            // si todo va bien, que me devuelva el correo
            return res.status(200).send({ email });
        });
    }

}

module.exports = controller;