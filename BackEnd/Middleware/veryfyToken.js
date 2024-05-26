/*Create a middleware function that will verify the JWT token on protected routes.*/
const jwt = require('jsonwebtoken');
const  JWT_SECRET_KEY='bfew78p48rn20rr'; // should not be here but for testing purposes


function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).send("A token is required for authentication");

  try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      console.log(decoded); // Debugging line
      req.user = decoded;
  } catch (err) {
      return res.status(401).send("Invalid Token");
  }
  return next();
}

module.exports = verifyToken;