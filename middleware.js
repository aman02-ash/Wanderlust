module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Save the original URL before redirecting to login
        console.log("Redirect URL saved:", req.session.redirectUrl); // Debugging log
        req.flash("err", "You must be logged in to create a new listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    } else {
        res.locals.redirectUrl = "/listings"; // Provide a default fallback URL
    }
    next();
};
