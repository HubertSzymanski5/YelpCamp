const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware"); // index is auto required

//-----------------------
// ROUTING - CAMPGROUNDS
//-----------------------

// INDEX - shaw all campgrounds
router.get("/", (req, res) => {
	// get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err) {
			console.log(err);
		}
		else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
		
	});
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var lat = req.body.lat;
	var lon = req.body.lon;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: image, lat: lat, lon: lon, description: description, author: author};
	// create a new campground and save to DB
	Campground.create( newCampground , function(err, newlyCreated){
		if(err){
			req.flash("error", "Something went wrong");
			console.log(err);
		}
		else {
			// redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});

});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

// SHOW - show more info about specific campground 
// REMEMBER ABOUT ROUTING must be AFTER /campgrounds/new because :id will catch new
router.get("/:id", (req, res) => {
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) => {
		if(err) {
			console.log(err);
		}
		else {
			// render show tempate with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT - show 
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {

	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", {campground: foundCampground});
	});

});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	// find and update the correct campground
	Campground.findByIdAndUpdate( req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			req.flash("error", "Something went wrong");
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground updated");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove( req.params.id, (err, deletedCampground) => {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			// delete also comments of that campground
			Comment.deleteMany( {_id: { $in: deletedCampground.comments }}, err => {
				if (err) {
					console.log(err);
					res.redirect("/campgrounds");
				} else
					res.redirect("/campgrounds");
			});
		}
	});
});

// export module
module.exports = router;
