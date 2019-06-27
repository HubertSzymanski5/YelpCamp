const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//--------------------
// ROUTING - COMMENTS
//--------------------


// CREATE - add new comment
router.post("/", middleware.isLoggedIn, (req, res) => {
	// find campground using id
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			// create new comment
			Comment.create(req.body.comment, (err, comment) => {
				if(err) {
					console.log(err);
				} else {
				// connect new comment with the campground
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					// save it
					campground.comments.push(comment);
					campground.save();
					// redirect to campground show page
					req.flash("success", "Comment Added");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// NEW - show form to add new comment to the campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
	// find campground by id
	Campground.findById( req.params.id, (err, campground) => {
		if(err) {
			req.flash("error", "Campground doesn't exist");
			res.redirect("back");
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// EDIT - show form to edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Comment.findById( req.params.comment_id, (err, foundComment) => {
		if ( err ) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate( req.params.comment_id, req.body.comment, err => {
		if ( err ) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id );
		}
	});
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove( req.params.comment_id, err => {
		if ( err ) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


// export module
module.exports = router;
