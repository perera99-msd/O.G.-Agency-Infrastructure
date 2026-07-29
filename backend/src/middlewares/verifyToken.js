const { auth, db } = require('../config/firebase');

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

    if (!auth || !auth.verifyIdToken || (process.env.NODE_ENV === 'development' && idToken === 'dev-mock-token')) {
      // Fallback verification mode if Firebase Auth isn't connected in dev
      // Or if we are in dev mode and using the hardcoded mock token from the frontend
      if (process.env.NODE_ENV === 'development') {
        req.user = { uid: 'dev-mock-uid', role: 'super_user' };
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
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(403).json({
          success: false,
          message: `Forbidden: Requires ${requiredRole} access privileges.`,
        });
      }

      // In dev mode, grant full super_user privileges
      if (process.env.NODE_ENV === 'development') {
        req.user.role = 'super_user';
        return next();
      }

      const hasRequiredRole = (role) =>
        requiredRole === 'admin'
          ? role === 'admin' || role === 'super_user'
          : role === 'super_user' || role === requiredRole;

      if (hasRequiredRole(req.user.role)) {
        return next();
      }

      // Fallback to Firestore Admin_Users role mapping
      if (db && req.user.uid) {
        const roleDoc = await db.collection('Admin_Users').doc(req.user.uid).get();
        const mappedRole = roleDoc.exists ? roleDoc.data()?.role : 'super_user';
        if (hasRequiredRole(mappedRole || 'super_user')) {
          req.user.role = mappedRole || 'super_user';
          return next();
        }
      }

      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires ${requiredRole} access privileges.`,
      });
    } catch (error) {
      console.error('❌ [Auth Middleware] Role verification failed:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Unable to verify access role.',
      });
    }
  };
};

module.exports = { verifyToken, verifyRole };
