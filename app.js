require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');



const connectDB = require('./Server/config/db');
const { isActiveRoute } = require('./Server/helpers/routeHelpers'); 

const app = express();
const PORT = process.env.PORT || 5000;
 
// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),

}));

app.use((req, res, next) => {
    res.locals.currentRoute = req.path;
    res.locals.isActiveRoute = isActiveRoute;
    next();
});

app.use(express.static('public'));

// Template Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./Server/routes/main'));
app.use('/', require('./Server/routes/admin'));

// app.get('', (req, res)=>{
//     res.send("Hello World");
// });

app.listen(PORT, ()=>{
    console.log(`App Listensing on Port ${PORT}`);  
});