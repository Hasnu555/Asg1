const jwt = require('jsonwebtoken');
const User = require('../models/User');


const requireAdmin = (req, res, next) => {
    // Check if the user is authenticated and has a role
    if (!res.locals.user || res.locals.user.role !== 'admin') {
        // If not an admin, redirect or send an error response
        return res.status(403).json({ error: 'Access denied: Admin permissions required.' });
    }
    // If the user is an admin, allow access to the route
    next();
};

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    //check json web token exists & is verified
    if(token){
        jwt.verify(token, 'hasan secret', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.redirect('/login');
    }
}

// check current user including role
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'hasan secret', async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                // console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = {
                    id: user.id,
                    email: user.email,
                    role: user.role 
                };
                next();
            }
        });
    }
    else{
        res.locals.user = null;
        next();
    }
}


module.exports = { requireAuth, checkUser,requireAdmin };
// module.exports = { requireAuth };