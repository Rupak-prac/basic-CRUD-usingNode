if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./utils/AppError.js');
const ejsMate = require('ejs-mate');
const houseRoute = require('./routes/houseRoutes');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users')
//const helmet = require('helmet');



mongoose.connect('mongodb://127.0.0.1:27017/ownHomesDB');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.engine('ejs', ejsMate);


const sessionConfigure = {
    secret: 'tHisIsSeCrEtStUuFf',
    resave: false,
    saveUninitialized: false,
    cookies: {
        httpOnly: true,
        name: 'ownHomes',
        //secure:true, // activate it when deploying, it breaks everthing during production. 
        expires: Date.now() + 1000*60*60*24*7, // 7 days in miliseconds from Date.now() 
        maxAge: 1000*60*60*24*7 
    }
}

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_methods'));
app.use( express.static( "public" ) ); //files in public dir can be accesed directly
app.use(session(sessionConfigure)); //syntax: app.use(session({options1:value1, option2:value2}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //Impo!! Note: it should be after sessionConfiguration

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{ //*********flash middleware Accessed in every templates*************** */
    res.locals.flashMsg = req.flash('success'); // "flashMsg" is rendered in templates. Note: under 'success' many messages are set.
    res.locals.flashMsg = req.flash('fail'); 
    res.locals.currentUser = req.user; // currentUser is used in templates. 
    next();
})

function storeLink(req, res, next){ // ******middleware to store currentLink*********
    if(req.session.origLink){
        res.locals.storedUrl = req.session.origLink;
    }
    next()
}

//**********routes ******************** */

app.get('/', (req, res)=>{
    res.render('home')
})
app.use('/houses', houseRoute) // using houseRoutes
//app.use('/houses/:id', reviewRoute) //here ":id" is house id.   
//*********************************** */

app.all('*', async(req,  res, next)=>{ // it runs, if no matching path routes found 
    next(new AppError(404, 'Page Not Found')); // and handle custom error to next error-middleware. 
})

app.use((err, req, res, next)=>{
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'some Error!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, ()=>{
    console.log('server 3000 is open...')
})