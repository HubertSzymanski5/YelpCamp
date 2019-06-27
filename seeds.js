const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

var data = [
	{
		name: "Mountain Home",
		image: "https://farm3.staticflickr.com/2947/15215548990_efc53d32b6.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu faucibus mi, a suscipit tortor. Donec vel dapibus lectus. Phasellus dignissim placerat mauris eget congue. Phasellus in lacus fermentum eros dignissim vehicula sit amet a odio. In hac habitasse platea dictumst. Sed nec urna lacus. Mauris vitae arcu et enim malesuada ornare sed maximus quam. Proin sed dolor sit amet risus posuere commodo. Nunc viverra tellus vel vestibulum feugiat. Phasellus gravida nisi elit. "
	},
	{
		name: "Woods Camp",
		image: "https://farm2.staticflickr.com/1179/1051152631_f8b4ae0a33.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu faucibus mi, a suscipit tortor. Donec vel dapibus lectus. Phasellus dignissim placerat mauris eget congue. Phasellus in lacus fermentum eros dignissim vehicula sit amet a odio. In hac habitasse platea dictumst. Sed nec urna lacus. Mauris vitae arcu et enim malesuada ornare sed maximus quam. Proin sed dolor sit amet risus posuere commodo. Nunc viverra tellus vel vestibulum feugiat. Phasellus gravida nisi elit. "
	},
	{
		name: "Valley Lake Camp",
		image: "https://farm1.staticflickr.com/23/36862842_6898ccbfff.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu faucibus mi, a suscipit tortor. Donec vel dapibus lectus. Phasellus dignissim placerat mauris eget congue. Phasellus in lacus fermentum eros dignissim vehicula sit amet a odio. In hac habitasse platea dictumst. Sed nec urna lacus. Mauris vitae arcu et enim malesuada ornare sed maximus quam. Proin sed dolor sit amet risus posuere commodo. Nunc viverra tellus vel vestibulum feugiat. Phasellus gravida nisi elit. "
	},
];



function seedDB() {
	// remove all campgrounds
	Campground.deleteMany({}, err => {
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds!!!");
		// add a few campgrounds
		data.forEach( seed => {
			Campground.create(seed, (err, campground) => {
				if(err) {
					console.log(err);
				} else {
					console.log("added a campground");
					// create a comment
					Comment.create({
						text: "This place is great, but I wish there was the Internet.",
						author: "Homer"
					}, (err, comment) => {
						if(err) {
							console.log(err);
						} else {
							campground.comments.push(comment);
							campground.save();
							console.log(" > created new comment");
						}
					});
				}
			});
		});
	});
}

module.exports = seedDB;