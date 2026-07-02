const express = require('express');
const router = express.Router();
const { getPublicDestinations, submitContactForm } = require('../controllers/websiteController');

/**
 * Public routes serving the Official Public Website (Unauthenticated)
 * Prefix: /api/v1/website
 */

// GET /api/v1/website/destinations -> List active destinations (Romania, Bosnia, Russia)
router.get('/destinations', getPublicDestinations);

// POST /api/v1/website/contact -> Submit candidate or client consultation inquiry
router.post('/contact', submitContactForm);

module.exports = router;
