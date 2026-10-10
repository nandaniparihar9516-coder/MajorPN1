if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}
console.log(process.env.SECRET);

const express = require("express");
const app =express();
const mongoose = require("mongoose");
const path = require('path');

const dbUrl = process.env.ATLASDB_URL;
require("dotenv").config();

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const  ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const {MongoStore} = require('connect-mongo');
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
main()
.then(()=>{
    console.log("connection successful");

    
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use((
    req,res,next
)=>{
    console.log(req.url);
    next();
});
app.get("/",(req,res)=>{
    res.redirect("/listings");
});

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error" , ()=>{
    console.log("ERROR IN MONGO SESSION ",err);
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};



// app.get("/",(req,res)=>{
//     res.send("root is working");
// });





app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currUser = req.user;
    console.log("yes it fix",req.user);
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");

    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);




app.use((err,req,res,next)=>{
    console.log(err);
    let {statusCode=500,message="Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
   
});


app.listen(8080,()=>{
    console.log("listening to the port");
});

