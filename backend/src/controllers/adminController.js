const { db, auth } = require('../config/firebase');
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

const destinationExistsAndActive = async (country) => {
  if (!db || !country) return true;
  const snap = await db.collection('destinations').where('country', '==', country).limit(5).get();
  if (snap.empty) return false;

  return snap.docs.some((doc) => {
    const data = doc.data() || {};
    if (typeof data.isActive === 'boolean') return data.isActive;
    if (typeof data.active === 'boolean') return data.active;
    return true;
  });
};

const computeStats = (jobs) => {
  const now = Date.now();
  const isExpired = (deadline) => new Date(deadline || 0).getTime() < now;

  return {
    total: jobs.length,
    active: jobs.filter((j) => j.active && !isExpired(j.deadline)).length,
    inactive: jobs.filter((j) => !j.active).length,
    expired: jobs.filter((j) => isExpired(j.deadline)).length,
    urgent: jobs.filter((j) => !!j.isUrgent).length,
  };
};

// The client uses this route as the authoritative authorization check after
// Firebase signs a user in.  Role checks remain on every mutating route too.
const getAdminSession = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      uid: req.user.uid,
      email: req.user.email || '',
      role: req.user.role || 'admin',
    },
  });
};

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

    const destinationIsAllowed = await destinationExistsAndActive(sanitizedData.country);
    if (!destinationIsAllowed) {
      return res.status(400).json({
        success: false,
        message: 'Destination is not available. Create and activate the destination first.',
      });
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
      if (req.body.country) {
        const destinationIsAllowed = await destinationExistsAndActive(req.body.country);
        if (!destinationIsAllowed) {
          return res.status(400).json({
            success: false,
            message: 'Destination is not available. Create and activate the destination first.',
          });
        }
      }

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

const getJobStats = async (req, res) => {
  try {
    if (!db) {
      return res.status(200).json({
        success: true,
        source: 'mock',
        data: computeStats(MOCK_JOBS),
      });
    }

    const snapshot = await db.collection('jobs').get();
    const jobs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json({ success: true, data: computeStats(jobs) });
  } catch (error) {
    console.error('❌ [Admin Controller] Error computing job stats:', error);
    return res.status(500).json({ success: false, message: 'Internal server error while computing job stats.' });
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

const getAllAdmins = async (req, res) => {
  try {
    if (!db) {
      return res.status(200).json({ success: true, data: [] });
    }
    const snapshot = await db.collection('Admin_Users').get();
    const admins = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    return res.status(200).json({ success: true, data: admins });
  } catch (error) {
    console.error('❌ [Admin Controller] Error fetching admins:', error);
    return res.status(500).json({ success: false, message: 'Internal server error fetching admins.' });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { email, password, displayName, jobTitle, role } = req.body;
    if (!email || !password || !displayName) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    
    if (!auth || !db) {
      return res.status(500).json({ success: false, message: 'Firebase Admin not configured.' });
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName
    });

    const userRole = role === 'super_user' ? 'super_user' : 'admin';
    
    // Set custom claims
    await auth.setCustomUserClaims(userRecord.uid, { role: userRole });

    // Save to Firestore
    await db.collection('Admin_Users').doc(userRecord.uid).set({
      email,
      displayName,
      jobTitle: jobTitle || 'Administrator',
      role: userRole,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ success: true, message: 'Admin created successfully.', uid: userRecord.uid });
  } catch (error) {
    console.error('❌ [Admin Controller] Error creating admin:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error creating admin.' });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!id || !role) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    
    if (!auth || !db) {
      return res.status(500).json({ success: false, message: 'Firebase Admin not configured.' });
    }

    const userRole = role === 'super_user' ? 'super_user' : 'admin';

    // Update custom claims
    await auth.setCustomUserClaims(id, { role: userRole });

    // Update Firestore
    await db.collection('Admin_Users').doc(id).update({
      role: userRole,
      updatedAt: new Date().toISOString(),
    });

    return res.status(200).json({ success: true, message: 'Admin updated successfully.' });
  } catch (error) {
    console.error('❌ [Admin Controller] Error updating admin:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error updating admin.' });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Admin ID required.' });
    }

    // Prevent self-deletion
    if (req.user.uid === id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });
    }
    
    if (!auth || !db) {
      return res.status(500).json({ success: false, message: 'Firebase Admin not configured.' });
    }

    await auth.deleteUser(id);
    await db.collection('Admin_Users').doc(id).delete();

    return res.status(200).json({ success: true, message: 'Admin deleted successfully.' });
  } catch (error) {
    console.error('❌ [Admin Controller] Error deleting admin:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error deleting admin.' });
  }
};

module.exports = {
  getAdminSession,
  getAllInquiries,
  createJobPosting,
  getAllJobsAdmin,
  getJobStats,
  updateJobPosting,
  deleteJobPosting,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
