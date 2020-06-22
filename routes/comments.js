const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// ==================
//   COMMENT ROUTES
// ==================

//New
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id)
        .then(campground => {
            res.render("comments/new", { campground: campground });
        })
        .catch(err => {
            console.error(err)
        });
})

//Create
router.post("/", (req, res) => {
    Campground.findById(req.params.id)
        .then(campground => {
            Comment.create(req.body.comment)
                .then(comment => {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    req.flash("success", "Successfully added comment");
                    res.redirect(`/campgrounds/${campground._id}`);
                })
                .catch(err => {
                    console.error(err);
                })
        })
        .catch(err => {
            console.error(err);
            res.redirect("/campgrounds");
        });
});

//Edit
router.get("/:commentID/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.commentID)
        .then(foundComment => {
            res.render("comments/edit", { campgroundID: req.params.id, comment: foundComment })
        })
        .catch(err => {
            console.error(err);
            res.redirect("back");
        })
});

//Update
router.put("/:commentID", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentID, req.body.comment)
        .then(updatedComment => {
            req.flash("success", "Successfully edited comment");
            res.redirect(`/campgrounds/${req.params.id}`)
        })
        .catch(err => {
            console.error(err);
            res.redirect("back");
        })
});

//Destroy
router.delete("/:commentID", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.commentID)
        .then(() => {
            req.flash("success", "Successfully deleted comment");
            res.redirect(`/campgrounds/${req.params.id}`);
        })
        .catch(err => {
            console.error(err);
            res.redirect("back");
        })
});

module.exports = router;