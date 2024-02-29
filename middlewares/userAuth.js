const isLogin = async (req, res, next) => {
    try {
        if (!req.session.user) {
            res.redirect("/");
            return; 
        }

        next();
    } catch (err) {
        console.log("error : ", err);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user) {
            res.redirect("/dashboard");
            return; 
        }

        next();
    } catch (err) {
        console.log("error : ", err);
    }
}

module.exports = { 
    isLogin,
    isLogout
}
