const isLogin = async (req,res) => {
    try {
        if(!req.session.user){
            res.redirect("/")
        }

        next();
    }catch (err) {
        console.log("error : ", err);
    }
}

const isLogout = async (req,res) => {
    try {
        if(req.session.user){
            res.redirect("/dashboard")
        }

        next();
    }catch (err) {
        console.log("error : ", err);
    }
}

module.exports = { 
    isLogin,
    isLogout
}