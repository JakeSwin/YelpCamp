const Comment = require("../models/comment");
const Campground = require("../models/campground");

//Middleware
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.campID)
            .then(foundCampground => {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            })
            .catch(err => {
                console.error(err);
                res.redirect("/campgrounds");
            });
    } else {
        req.flash("error", "You must be logged in first")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentID)
            .then(foundComment => {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            })
            .catch(err => {
                console.error(err);
                res.redirect("/campgrounds");
            });
    } else {
        req.flash("error", "You must be logged in first")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in first");
    res.redirect("/login");
}

module.exports = middlewareObj;