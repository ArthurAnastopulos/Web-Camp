const express = require('express');
const app = express();
const engine = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const { resolveSoa } = require('dns');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const { fork } = require('child_process');

mongoose.connect('mongodb://localhost:27017/web-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database conneceted');
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'test',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, something went wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log("Serving in port 3000");
});