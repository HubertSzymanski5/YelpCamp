const 	express 	= require("express"), // add express
		app 		= express(),
		bodyParser 	= require("body-parser"), // add body-parser
		mongoose 	= require("mongoose"), // add mongoose
		flash		= require("connect-flash"),
		passport	= require("passport"),
		LocalStrategy = require("passport-local"),
		methodOverride = require("method-override"),
		Campground 	= require("./models/campground"), // add campground model
		Comment 	= require("./models/comment"), // add comment model
		User		= require("./models/user"),
		seedDB 		= require("./seeds"); // add seed DB

// routes
const	commentRoutes = require("./routes/comments"),
		campgroundsRoutes = require("./routes/campgrounds"),
		indexRoutes = require("./routes/index");

//---------------
// CONFIGURATION
//---------------

// use body parser
app.use( bodyParser.urlencoded( {extended: true} ) );
// connect with database
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
// define port to run on
const PORT = 3000;
app.listen(PORT, () => {
	console.log("The YelpCamp listens on port: " + PORT);
});
// set view engine to ejs
app.set("view engine", "ejs");
// use css and public file
app.use(express.static(__dirname + "/public"));
// use method-override
app.use(methodOverride("_method"));
// use flash
app.use(flash());
// run seed to clear data
// seedDB();

// PASSPORT CONFIGURATION
app.use( require("express-session")({
	secret: "nvg8u4302hg9io34e095hdf0",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// it's middleware to EVERY route
app.use( (req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// use routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
