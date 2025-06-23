if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
} 

console.log(process.env.SECRET) 
const express=require("express");
const app=express();
const mongoose=require("mongoose");

 const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
//const dbUrl=process.env.ATLASDB_URL;

const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session = require("express-session");
const mongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const ExpressError=require("./utils/ExpressError.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const emitter = require('events');
emitter.defaultMaxListeners = 20;
// const store=mongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret:process.env.SECRET,
//     },
//     touchAfter:24*3600,
// });
// store.on("error",()=>{
//     console.log("ERROR IN MONGO SESSION STORE",err);
// })
const sessionOptions={
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
// app.get("/",(req,res)=>{
//     res.send("Hi, i am root");
// });

app.get("/user",function(req,res){
    res.status(300).send("Error");
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);
    




app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something is Wrong"}=err;
    res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
    
});
app.listen(3000,()=>{
    console.log("server listening");
});