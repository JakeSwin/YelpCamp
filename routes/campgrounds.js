const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const { closeDelimiter } = require("ejs");
const middleware = require("../middleware")

// ===================
//  CAMPGROUND ROUTES
// ===================

router.get("/", (req, res) => {
    Campground.find({})
        .then(campgrounds => {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        })
        .catch(err => {
            console.error(err);
        });
});

//New
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
});

//Create
router.post("/", middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = { name: name, image: image, description: desc, author: author };

    Campground.create(newCampground)
        .then(campground => {
            console.log("Newly Created Campground")
            console.log(campground);
            req.flash("success", "Successfully created new Campground");
            res.redirect("/campgrounds");
        })
        .catch(err => {
            console.error(err);
        });
});

//Show 
router.get("/:campID", (req, res) => {
    Campground.findById(req.params.campID).populate("comments").exec()
        .then(foundCampground => {
            res.render("campgrounds/show", { campground: foundCampground });
        })
        .catch(err => {
            console.error(err)
        });
});

//Edit Campground Route
router.get("/:campID/edit", middleware.checkCampgroundOwnership, (req, res) => {
        Campground.findById(req.params.campID)
            .then(foundCampground => {
                res.render("campgrounds/edit", { campground: foundCampground });
            })
            .catch(err => {
                console.error(err);
                res.redirect("/campgrounds");
            });
});

//Update Campground Route
router.put("/:campID", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.campID, req.body.camp)
        .then(updatedCampground => {
            res.redirect(`/campgrounds/${req.params.campID}`)
        })
        .catch(err => {
            console.error(err);
            res.redirect("/campgrounds");
        })
});

//Destroy Campground Route
router.delete("/:campID", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.campID)
        .then(() => {
            res.redirect("/campgrounds");
        })
        .catch(err => {
            console.error(err);
            res.redirect("/campgrounds");
        })
})

module.exports = router;