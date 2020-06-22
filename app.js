const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
//let seeds = require("./seeds");

let port = process.env.PORT || 3000;

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false); //Fixes error FindAnd... Methods
mongoose.connect("mongodb+srv://YelpUser:Yelp.p@ss@yelpcamp-mfxfp.mongodb.net/yelp_camp?retryWrites=true&w=majority", {useNewUrlParser: true})
    .catch(err => {
        console.error(err)
    });

app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

//MODELS
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Camping in the woods",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

//Routes
var campgroundRoutes = require("./routes/campgrounds"), 
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});