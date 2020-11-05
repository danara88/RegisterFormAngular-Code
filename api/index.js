const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = require('./app');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/03-reactive-auth').then(() => {
    console.log('Connected to database');
    app.listen(port, () => {
        console.log('Litening at http://localhost:3000');
    });
})
.catch(err => {
    console.log(err);
});