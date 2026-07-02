const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const { getCandidateProfile, getCandidateApplicationStatus } = require('../controllers/pwaController');

/**
 * Protected routes serving the Customer PWA (Requires candidate auth token)
 * Prefix: /api/v1/pwa
 */

// Apply Firebase token verification to all PWA routes
router.use(verifyToken);

// GET /api/v1/pwa/profile -> Get candidate profile details
router.get('/profile', getCandidateProfile);

// GET /api/v1/pwa/status -> Get visa processing milestones & document progress
router.get('/status', getCandidateApplicationStatus);

module.exports = router;
