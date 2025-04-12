const jwt = require('jsonwebtoken');
exports.authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ','');
    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({message:'Unauthorized'});
    }
};

exports.authorize = (roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)){
        return res.status(403).json({message:'Forbidden'});
    }
    next();
};