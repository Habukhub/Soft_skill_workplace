
require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const connectDB = require('./config/connectDB');
const {checkUser} = require('./config/auth');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 4000;



//data connect
connectDB(process.env.MONGODB_URI);

//milddleware
app.use(cookieParser());
app.set('views', (path.join(__dirname, 'views')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.JWT_SECRET,
        saveUninitialized: true,
        resave: false,
        
    })
);

app.use(checkUser);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// set template engine
app.set('view engine', 'ejs');

const router = require('./routes/routes');


// route prefix
app.use("/", router);

app.use(express.static(path.join(__dirname,'public')));

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/home`);
});