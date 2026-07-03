const express = require('express');
const router = express.Router();
const { 
  getPublicDestinations, 
  submitContactForm, 
  getPublicJobs, 
  getJobDetails 
} = require('../controllers/websiteController');

/**
 * Public routes serving the Official Public Website (Unauthenticated)
 * Prefix: /api/v1/website
 */

// GET /api/v1/website/destinations -> List active destinations (Romania, Bosnia, Russia)
router.get('/destinations', getPublicDestinations);

// POST /api/v1/website/contact -> Submit candidate or client consultation inquiry
router.post('/contact', submitContactForm);

// GET /api/v1/website/jobs -> List all active jobs
router.get('/jobs', getPublicJobs);

// GET /api/v1/website/jobs/:id -> Fetch details for a specific job
router.get('/jobs/:id', getJobDetails);

module.exports = router;
