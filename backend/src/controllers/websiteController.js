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

module.exports = {
  getPublicDestinations,
  submitContactForm,
};
