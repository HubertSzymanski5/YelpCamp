const Campground = require("../models/campground");
const Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	// is user logged in
	if( req.isAuthenticated() ) {
		// does user own the campground
		Campground.findById(req.params.id, (err, foundCampground) => {
			if ( err ) {
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				// make sure campground exist
				if( !foundCampground ) {
					req.flash("error", "Campground not found");
					res.redirect("back");
				}
				// does user own the campground
				if( foundCampground.author.id.equals( req.user._id)) {
					next();
				} else {
					// user not allowed to edit campground
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		// no user log in
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
	// is user logged in
	if( req.isAuthenticated() ) {
		// does user own the campground
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if ( err ) {
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				// does user own the campground
				if( foundComment.author.id.equals( req.user._id)) {
					next();
				} else {
					// user not allowed to edit campground
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		// no user log in
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function (req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} 
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};

module.exports = middlewareObj;