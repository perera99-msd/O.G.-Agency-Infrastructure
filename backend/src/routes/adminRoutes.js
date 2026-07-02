const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/verifyToken');
const { getAllInquiries, createJobPosting } = require('../controllers/adminController');

/**
 * Protected administrative routes serving the Admin Dashboard
 * Prefix: /api/v1/admin
 */

// Apply Firebase token verification and enforce 'admin' role privilege
router.use(verifyToken);
router.use(verifyRole('admin'));

// GET /api/v1/admin/inquiries -> Retrieve all consultation inquiries submitted via website
router.get('/inquiries', getAllInquiries);

// POST /api/v1/admin/jobs -> Create and publish new job openings
router.post('/jobs', createJobPosting);

module.exports = router;
