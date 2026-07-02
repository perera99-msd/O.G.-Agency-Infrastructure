const { db } = require('../config/firebase');
const { validateJobPosting } = require('../models');

/**
 * Controller for Admin Dashboard endpoints (Protected administrative access)
 */
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
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Job posting created (Mock mode).',
      data: sanitizedData,
    });
  } catch (error) {
    console.error('❌ [Admin Controller] Error creating job:', error);
    return res.status(500).json({ success: false, message: 'Internal server error while creating job.' });
  }
};

module.exports = {
  getAllInquiries,
  createJobPosting,
};
