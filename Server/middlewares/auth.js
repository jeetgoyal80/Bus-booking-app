import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Get token from headers (usually in Authorization header as: "Bearer <token>")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract token part

  try {
    // Verify token with your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object (depends on what you encoded in the token)
    req.user = decoded.user; 
    
    

    next(); // token valid, proceed to next middleware or route
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
