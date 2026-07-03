const { db } = require('../config/firebase');
const { validateContactSubmission } = require('../models');

/**
 * Controller for Official Public Website endpoints (Public Read / Inquiry Submissions)
 */
const getPublicDestinations = async (req, res) => {
  try {
    // Mock return if Firestore is not yet seeded or connected
    if (!db) {
      return res.status(200).json({
        success: true,
        source: 'mock',
        data: [
          { id: 'romania', country: 'Romania', region: 'Europe', activeJobs: 24 },
          { id: 'bosnia', country: 'Bosnia & Herzegovina', region: 'Europe', activeJobs: 18 },
          { id: 'russia', country: 'Russia', region: 'Eurasia', activeJobs: 35 },
        ],
      });
    }

    const snapshot = await db.collection('destinations').where('active', '==', true).get();
    const destinations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({ success: true, count: destinations.length, data: destinations });
  } catch (error) {
    console.error('❌ [Website Controller] Error fetching destinations:', error);
    return res.status(500).json({ success: false, message: 'Internal server error fetching destinations.' });
  }
};

const submitContactForm = async (req, res) => {
  try {
    const { isValid, errors, sanitizedData } = validateContactSubmission(req.body);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    if (db) {
      const docRef = await db.collection('inquiries').add(sanitizedData);
      return res.status(201).json({
        success: true,
        message: 'Inquiry successfully submitted.',
        inquiryId: docRef.id,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully (Mock mode).',
      data: sanitizedData,
    });
  } catch (error) {
    console.error('❌ [Website Controller] Error submitting inquiry:', error);
    return res.status(500).json({ success: false, message: 'Internal server error while processing inquiry.' });
  }
};

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

const getPublicJobs = async (req, res) => {
  try {
    if (!db) {
      return res.status(200).json({
        success: true,
        source: 'mock',
        data: MOCK_JOBS,
      });
    }

    const snapshot = await db.collection('jobs').where('active', '==', true).get();
    let jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort in memory to avoid requiring a Firestore composite index
    jobs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    console.error('❌ [Website Controller] Error fetching public jobs:', error);
    return res.status(500).json({ success: false, message: 'Internal server error fetching jobs.' });
  }
};

const getJobDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    if (!db) {
      const mockJob = MOCK_JOBS.find(j => j.id === id);
      if (!mockJob) {
        return res.status(404).json({ success: false, message: 'Job not found or inactive' });
      }
      return res.status(200).json({
        success: true,
        source: 'mock',
        data: mockJob,
      });
    }

    const jobDoc = await db.collection('jobs').doc(id).get();

    if (!jobDoc.exists || !jobDoc.data().active) {
      return res.status(404).json({ success: false, message: 'Job not found or inactive' });
    }

    return res.status(200).json({ success: true, data: { id: jobDoc.id, ...jobDoc.data() } });
  } catch (error) {
    console.error('❌ [Website Controller] Error fetching job details:', error);
    return res.status(500).json({ success: false, message: 'Internal server error fetching job details.' });
  }
};

module.exports = {
  getPublicDestinations,
  submitContactForm,
  getPublicJobs,
  getJobDetails,
};
