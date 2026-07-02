const { db } = require('../config/firebase');

/**
 * Controller for Customer PWA endpoints (Requires authenticated candidate token)
 */
const getCandidateProfile = async (req, res) => {
  try {
    const { uid } = req.user;

    if (!db) {
      return res.status(200).json({
        success: true,
        source: 'mock',
        data: {
          uid,
          fullName: 'Candidate Perera',
          status: 'Visa Processing',
          assignedDestination: 'Romania',
          documentsUploaded: 4,
        },
      });
    }

    const docRef = await db.collection('candidates').doc(uid).get();
    if (!docRef.exists) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    return res.status(200).json({ success: true, data: docRef.data() });
  } catch (error) {
    console.error('❌ [PWA Controller] Error retrieving profile:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getCandidateApplicationStatus = async (req, res) => {
  try {
    const { uid } = req.user;

    return res.status(200).json({
      success: true,
      data: {
        currentStage: 'Document Attestation & Medical Check',
        progressPercentage: 65,
        nextMilestone: 'Embassy Visa Interview',
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving status.' });
  }
};

module.exports = {
  getCandidateProfile,
  getCandidateApplicationStatus,
};
