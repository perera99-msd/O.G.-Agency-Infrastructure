const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/verifyToken');
const { 
  getAllInquiries, 
  getAdminSession,
  createJobPosting, 
  getAllJobsAdmin, 
  getJobStats,
  updateJobPosting, 
  deleteJobPosting,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
} = require('../controllers/adminController');
const {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateMedicalStatus,
  updateTracking,
} = require('../controllers/employeeController');

/**
 * Protected administrative routes serving the Admin Dashboard
 * Prefix: /api/v1/admin
 */

// Apply Firebase token verification and enforce 'admin' role privilege
router.use(verifyToken);
router.use(verifyRole('admin'));

// GET /api/v1/admin/session -> Confirm that the signed-in Firebase user is an administrator
router.get('/session', getAdminSession);

// GET /api/v1/admin/inquiries -> Retrieve all consultation inquiries submitted via website
router.get('/inquiries', getAllInquiries);

// GET /api/v1/admin/jobs -> List all jobs (including inactive ones)
router.get('/jobs', getAllJobsAdmin);

// GET /api/v1/admin/jobs/stats -> Aggregate job metrics for admin overview
router.get('/jobs/stats', getJobStats);

// POST /api/v1/admin/jobs -> Create and publish new job openings
router.post('/jobs', createJobPosting);

// PUT /api/v1/admin/jobs/:id -> Update an existing job posting (e.g. mark inactive)
router.put('/jobs/:id', updateJobPosting);

// DELETE /api/v1/admin/jobs/:id -> Permanently remove a job posting
router.delete('/jobs/:id', deleteJobPosting);

// --- Super Admin Management Routes ---
router.get('/users', verifyRole('super_user'), getAllAdmins);
router.post('/users', verifyRole('super_user'), createAdmin);
router.put('/users/:id', verifyRole('super_user'), updateAdmin);
router.delete('/users/:id', verifyRole('super_user'), deleteAdmin);

// --- Employee Management Routes ---
router.get('/employees', getAllEmployees);
router.post('/employees', createEmployee);
router.get('/employees/:id', getEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);
router.put('/employees/:id/medical', updateMedicalStatus);
router.put('/employees/:id/tracking', updateTracking);

module.exports = router;
