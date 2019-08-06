if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const mainRouter = require('./routes/index');
const authorsRouter = require('./routes/authors');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log('Mongoose connection I presume'));

app.use('/', mainRouter);
app.use('/authors', authorsRouter);

app.listen(process.env.PORT || 3000);