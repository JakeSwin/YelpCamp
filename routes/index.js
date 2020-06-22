const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// ==================
//    LANDING ROUTE
// ==================

router.get("/", (req, res) => {
    res.render("landing");
});

// ==================
//     AUTH ROUTES
// ==================

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message)
            //return res.render("register")
            res.redirect("register")
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Welcome to YelpCamp ${user.username}`);
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => { 
    req.flash("success", "Successfully logged in");
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/campgrounds");
});

module.exports = router;