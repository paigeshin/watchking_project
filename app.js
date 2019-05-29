//Import Modules
var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    expressSession = require("express-session"),
    methodOverride = require("method-override"),
    restfulRequest = require("request"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    connectFlash = require("connect-flash");
//Import Models
var User = require("./models/user");

//Import Routes
var AuthRoutes = require("./routes/index");

//Module Setting
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://127.0.0.1/shopping_app", {
    useNewUrlParser: true
});
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(
    expressSession({
        secret: "Demo Application",
        resave: false,
        saveUninitialized: false
    })
);
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
app.use(connectFlash());

//App System Variable
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//Route Setting
app.use("/", AuthRoutes);


app.listen(3000, "127.0.0.1", function(){
    console.log("Our shopping mall server has started");
});