import jwt from 'jsonwebtoken';

const handleAdminAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in or sign up.',
    });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.admin = decoded;

    next();

  } catch (error) {
 
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

export default handleAdminAuth;
