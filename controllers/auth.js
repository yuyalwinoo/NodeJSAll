exports.getLoginPage = (req,res)=> {
    res.render("auth/login",{title:'Login'})
}

exports.postLoginData = (req,res) => {
    //res.setHeader("Set-Cookie","isLogin=true");
    req.session.isLogin = true;
    res.redirect("/posts");
}

exports.logout = (req,res)=> {
    
    req.session.destroy(()=>{
        res.redirect("/posts")
    });
}
