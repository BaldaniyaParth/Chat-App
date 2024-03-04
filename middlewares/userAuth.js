// Middleware to check if user is logged in
exports.isLogin = async (req, res, next) => {
    try {
        // If user is not logged in, redirect to home page
        if (!req.session.user) {
            res.redirect("/");
            return; 
        }

        // If user is logged in, proceed to next middleware or route handler
        next();
    } catch (err) {
        console.log("error : ", err);
    }
}


// Middleware to check if user is logged out
exports.isLogout = async (req, res, next) => {
    try {
        // If user is logged in, redirect to dashboard
        if (req.session.user) {
            res.redirect("/dashboard");
            return; 
        }

        // If user is logged out, proceed to next middleware or route handler
        next();
    } catch (err) {
        console.log("error : ", err);
    }
}
