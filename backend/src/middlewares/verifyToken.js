const { auth } = require('../config/firebase');

/**
 * Middleware to verify Firebase ID tokens passed in the Authorization header.
 * Expects header format: Authorization: Bearer <ID_TOKEN>
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Missing or invalid Authorization header token.',
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (!auth || !auth.verifyIdToken) {
      // Fallback verification mode if Firebase Auth isn't connected in dev
      if (process.env.NODE_ENV === 'development') {
        req.user = { uid: 'dev-mock-uid', role: 'admin' };
        return next();
      }
      return res.status(500).json({ success: false, message: 'Firebase Auth service unavailable.' });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken; // Attach decoded user info (uid, email, role claims) to request object
    next();
  } catch (error) {
    console.error('❌ [Auth Middleware] Token Verification Failed:', error.message);
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Invalid or expired authentication token.',
    });
  }
};

/**
 * Role verification middleware factory (e.g., verifyRole('admin'))
 */
const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires ${requiredRole} access privileges.`,
      });
    }
    next();
  };
};

module.exports = { verifyToken, verifyRole };
