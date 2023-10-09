const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const apiRouter = require('./routes/apiRouter');
const viewRouter = require('./routes/viewRouter');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '1mb' }));
app.use(session({
	secret: 'IASFDSAKFSAsadf1231!1423.1234--!!??¡sdadsaasdZSD',
	resave: false,
	saveUninitialized: false
}));
app.use('/api', apiRouter);
app.use(express.static(path.join(__dirname, 'public')));
app.use(viewRouter);

module.exports = app;