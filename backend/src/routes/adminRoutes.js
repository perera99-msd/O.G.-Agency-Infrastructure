const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/verifyToken');
const { 
  getAllInquiries, 
  createJobPosting, 
  getAllJobsAdmin, 
  updateJobPosting, 
  deleteJobPosting 
} = require('../controllers/adminController');

/**
 * Protected administrative routes serving the Admin Dashboard
 * Prefix: /api/v1/admin
 */

// Apply Firebase token verification and enforce 'admin' role privilege
router.use(verifyToken);
router.use(verifyRole('admin'));

// GET /api/v1/admin/inquiries -> Retrieve all consultation inquiries submitted via website
router.get('/inquiries', getAllInquiries);

// GET /api/v1/admin/jobs -> List all jobs (including inactive ones)
router.get('/jobs', getAllJobsAdmin);

// POST /api/v1/admin/jobs -> Create and publish new job openings
router.post('/jobs', createJobPosting);

// PUT /api/v1/admin/jobs/:id -> Update an existing job posting (e.g. mark inactive)
router.put('/jobs/:id', updateJobPosting);

// DELETE /api/v1/admin/jobs/:id -> Permanently remove a job posting
router.delete('/jobs/:id', deleteJobPosting);

module.exports = router;
