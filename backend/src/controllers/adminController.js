const { db } = require('../config/firebase');
const { validateJobPosting } = require('../models');

/**
 * Controller for Admin Dashboard endpoints (Protected administrative access)
 */

const MOCK_JOBS = [
  {
    id: "job-001",
    title: "Juki Machine Operator",
    slug: "juki-machine-operator",
    category: "Garment",
    tags: ["URGENT", "GARMENT"],
    country: "Bosnia",
    salary: { min: 120000, max: 150000, currency: "LKR" },
    deadline: "2026-11-25",
    postedAt: "2026-04-05",
    isUrgent: true,
    genderPreference: "No Preference",
    ageRange: { min: 25, max: 45 },
    description: "We are seeking experienced Juki Machine Operators to join a leading garment manufacturing facility in Qatar.",
    requirements: [
      "Minimum 2 years of experience with industrial sewing machines",
      "Ability to work in a fast-paced production environment",
      "A sound understanding of basic workplace safety and hygiene standards"
    ],
    benefits: [
      { title: "Comprehensive Health", description: "Full medical, dental, and vision coverage." },
      { title: "Unlimited PTO", description: "Take the time you need to recharge." },
      { title: "Competitive Salary", description: "Competitive salary with performance bonuses." }
    ],
    companyLogo: null,
    active: false
  },
  {
    id: "job-002",
    title: "Construction Foreman",
    slug: "construction-foreman",
    category: "Construction",
    tags: ["URGENT", "CONSTRUCTION"],
    country: "Cyprus",
    salary: { min: 140000, max: 170000, currency: "USD" },
    deadline: "2026-10-25",
    postedAt: "2026-06-01",
    isUrgent: true,
    genderPreference: "Male",
    ageRange: { min: 28, max: 50 },
    description: "Lead construction crews on large-scale infrastructure projects across Dubai.",
    requirements: [
      "5+ years experience in construction supervision",
      "Valid construction safety certification"
    ],
    benefits: [
      { title: "Housing Allowance", description: "Fully furnished accommodation provided." },
      { title: "Annual Flights", description: "Two return flights to Sri Lanka per year." }
    ],
    companyLogo: null,
    active: true
  },
  {
    id: "job-003",
    title: "Registered Nurse – ICU",
    slug: "registered-nurse-icu",
    category: "Healthcare",
    tags: ["URGENT", "HEALTHCARE"],
    country: "Germany",
    salary: { min: 90000, max: 130000, currency: "USD" },
    deadline: "2026-12-25",
    postedAt: "2026-04-01",
    isUrgent: true,
    genderPreference: "Female",
    ageRange: { min: 24, max: 45 },
    description: "Join a world-class hospital in Riyadh as an ICU Registered Nurse.",
    requirements: [
      "BSc in Nursing or equivalent",
      "Minimum 3 years ICU experience"
    ],
    benefits: [
      { title: "Tax-Free Salary", description: "Full salary paid tax-free." },
      { title: "Housing & Transport", description: "Fully furnished accommodation and daily transport provided." }
    ],
    companyLogo: null,
    active: true
  }
];

const getAllInquiries = async (req, res) => {
  try {
    if (!db) {
      return res.status(200).json({
        success: true,
        source: 'mock',
        data: [
          { id: '101', name: 'John Doe', email: 'john@example.com', destinationOfInterest: 'Romania', status: 'new' },
          { id: '102', name: 'Alice Smith', email: 'alice@example.com', destinationOfInterest: 'Bosnia', status: 'contacted' },
        ],
      });
    }

    const snapshot = await db.collection('inquiries').orderBy('submittedAt', 'desc').get();
    const inquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    console.error('❌ [Admin Controller] Error fetching inquiries:', error);
    return res.status(500).json({ success: false, message: 'Internal server error fetching inquiries.' });
  }
};

const createJobPosting = async (req, res) => {
  try {
    const { isValid, errors, sanitizedData } = validateJobPosting(req.body);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid job data provided', errors });
    }

    if (db) {
      const docRef = await db.collection('jobs').add(sanitizedData);
      return res.status(201).json({
        success: true,
        message: 'Job posting published successfully.',
        jobId: docRef.id,
        data: { id: docRef.id, ...sanitizedData },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Job posting created (Mock mode).',
      data: { id: `mock-${Date.now()}`, ...sanitizedData },
    });
  } catch (error) {
    console.error('❌ [Admin Controller] Error creating job:', error);
    return res.status(500).json({ success: false, message: 'Internal server error while creating job.' });
  }
};

const getAllJobsAdmin = async (req, res) => {
  try {
    if (!db) {
      return res.status(200).json({
        success: true,
        source: 'mock',
        data: MOCK_JOBS,
      });
    }

    const snapshot = await db.collection('jobs').orderBy('createdAt', 'desc').get();
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    console.error('❌ [Admin Controller] Error fetching jobs:', error);
    return res.status(500).json({ success: false, message: 'Internal server error fetching jobs.' });
  }
};

const updateJobPosting = async (req, res) => {
  try {
    const { id } = req.params;
    
    // We can allow partial updates, so we don't strictly use the creation validator for everything,
    // or we validate and only extract valid fields. For simplicity, we just pass body directly to update.
    // A robust app would use a specific update validator.
    
    if (!id) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    if (db) {
      const jobRef = db.collection('jobs').doc(id);
      const jobDoc = await jobRef.get();
      
      if (!jobDoc.exists) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      
      await jobRef.update({ ...req.body, updatedAt: new Date().toISOString() });
      
      return res.status(200).json({
        success: true,
        message: 'Job posting updated successfully.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Job posting updated (Mock mode).',
    });
  } catch (error) {
    console.error('❌ [Admin Controller] Error updating job:', error);
    return res.status(500).json({ success: false, message: 'Internal server error while updating job.' });
  }
};

const deleteJobPosting = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    if (db) {
      const jobRef = db.collection('jobs').doc(id);
      const jobDoc = await jobRef.get();
      
      if (!jobDoc.exists) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      
      await jobRef.delete();
      
      return res.status(200).json({
        success: true,
        message: 'Job posting deleted successfully.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Job posting deleted (Mock mode).',
    });
  } catch (error) {
    console.error('❌ [Admin Controller] Error deleting job:', error);
    return res.status(500).json({ success: false, message: 'Internal server error while deleting job.' });
  }
};

module.exports = {
  getAllInquiries,
  createJobPosting,
  getAllJobsAdmin,
  updateJobPosting,
  deleteJobPosting,
};
