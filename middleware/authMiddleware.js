const jwt = require('jsonwebtoken');
const { SECRET_TOKEN } = process.env;

const requireAuth = (req, res, next) => {
   const token = req.cookies.jwt;

   //check json web token exists and valid
   if(token){
      jwt.verify(token, SECRET_TOKEN, (err, decodedToken) => {
         if(err){
            res.status(401).json( {error: "User not authorized"} );
         }
         else{
            req.id = decodedToken.id;
            next();
         }
      })
   }
   else{
      res.status(401).json( {error: "User not authorized"} );
   }
}


module.exports = {requireAuth};