const express = require('express');
const api = express.Router();
const UserCtr = require('../controllers/user.controller');

// registrar un usuario
api.post('/register', UserCtr.register);

// comprobar que el nombre de usuario sea unico
api.post('/not-repeated-nickname/:nickname', UserCtr.noRepeatedNickname);

// comprobar que el correo no este registrado
api.post('/not-repeated-email/:email', UserCtr.noRepeatedEmail);

module.exports = api;