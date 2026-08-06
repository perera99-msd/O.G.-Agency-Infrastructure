const { db } = require('../config/firebase');

const COLLECTION = 'employees';

/**
 * GET /api/v1/admin/employees
 * List all employees with optional filters: country, status, medicalStatus, agency, company, jobCategory
 */
const getAllEmployees = async (req, res) => {
  try {
    const { country, status, medicalStatus, agency, company, jobCategory, search } = req.query;

    const snapshot = await db.collection(COLLECTION).orderBy('registeredAt', 'desc').get();
    let employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Apply filters
    if (country) employees = employees.filter(e => e.countryApplied === country);
    if (status) employees = employees.filter(e => e.status === status);
    if (medicalStatus) employees = employees.filter(e => e.medicalStatus === medicalStatus);
    if (agency) employees = employees.filter(e => e.sourceAgency === agency);
    if (company) employees = employees.filter(e => e.company === company);
    if (jobCategory) employees = employees.filter(e => e.jobCategory === jobCategory);
    if (search) {
      const q = search.toLowerCase();
      employees = employees.filter(e =>
        (e.fullName || '').toLowerCase().includes(q) ||
        (e.passportNumber || '').toLowerCase().includes(q) ||
        (e.nicNumber || '').toLowerCase().includes(q) ||
        (e.phone1 || '').includes(q) ||
        (e.phone2 || '').includes(q)
      );
    }

    return res.status(200).json({ success: true, data: employees, count: employees.length });
  } catch (err) {
    console.error('getAllEmployees error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve employees.' });
  }
};

/**
 * GET /api/v1/admin/employees/:id
 * Get a single employee by Firestore document ID
 */
const getEmployee = async (req, res) => {
  try {
    const docRef = db.collection(COLLECTION).doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    return res.status(200).json({ success: true, data: { id: docSnap.id, ...docSnap.data() } });
  } catch (err) {
    console.error('getEmployee error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve employee.' });
  }
};

/**
 * POST /api/v1/admin/employees
 * Register a new employee
 */
const createEmployee = async (req, res) => {
  try {
    const data = req.body;
    if (!data.fullName || !data.passportNumber || !data.countryApplied) {
      return res.status(400).json({ success: false, message: 'fullName, passportNumber, and countryApplied are required.' });
    }

    // Check for duplicate passport number
    const existing = await db.collection(COLLECTION).where('passportNumber', '==', data.passportNumber).get();
    if (!existing.empty) {
      return res.status(409).json({ success: false, message: `An employee with passport number "${data.passportNumber}" already exists.` });
    }

    const defaultTracking = [
      { step: 'Application Submitted', completed: false, date: null, fileUrl: null },
      { step: 'Medical Examination', completed: false, date: null, fileUrl: null },
      { step: 'Visa Application', completed: false, date: null, fileUrl: null },
      { step: 'Embassy Interview', completed: false, date: null, fileUrl: null },
      { step: 'Flight Booking', completed: false, date: null, fileUrl: null },
      { step: 'Departure', completed: false, date: null, fileUrl: null },
    ];

    const newEmployee = {
      // Personal
      fullName: data.fullName || '',
      passportNumber: data.passportNumber || '',
      passportIssuedDate: data.passportIssuedDate || '',
      passportExpireDate: data.passportExpireDate || '',
      previousPassportNumbers: data.previousPassportNumbers || '',
      nicNumber: data.nicNumber || '',
      dob: data.dob || '',
      age: data.age ? Number(data.age) : null,
      gender: data.gender || '',
      civilStatus: data.civilStatus || '',
      race: data.race || '',
      adminDistrict: data.adminDistrict || '',

      // Employment
      countryApplied: data.countryApplied || '',
      sourceAgency: data.sourceAgency || '',
      jobCategory: data.jobCategory || '',
      company: data.company || '',
      expectedInstitutions: data.expectedInstitutions || [],

      // Contact
      address: data.address || '',
      postalTown: data.postalTown || '',
      email: data.email || '',
      phone1: data.phone1 || '',
      phone2: data.phone2 || '',
      whatsapp: data.whatsapp || '',
      dsDivision: data.dsDivision || '',
      gnDivision: data.gnDivision || '',

      // Education
      education: data.education || '',
      educationOther: data.educationOther || '',
      expSriLanka: data.expSriLanka || '',
      periodSriLanka: data.periodSriLanka || '',
      abroadBefore: data.abroadBefore || 'no',
      expAbroad: data.expAbroad || '',
      periodAbroad: data.periodAbroad || '',
      abroadCountry: data.abroadCountry || '',

      // Family
      motherName: data.motherName || '',
      motherPhone: data.motherPhone || '',
      fatherName: data.fatherName || '',
      fatherPhone: data.fatherPhone || '',

      // Trustee
      trusteeName: data.trusteeName || '',
      trusteeRelation: data.trusteeRelation || '',
      trusteeAddress: data.trusteeAddress || '',
      trusteePhone: data.trusteePhone || '',
      trusteeNIC: data.trusteeNIC || '',

      // Banking
      bankName: data.bankName || '',
      bankBranch: data.bankBranch || '',
      accountNumber: data.accountNumber || '',
      accountHolderName: data.accountHolderName || '',

      // Medical
      medicalStatus: 'pending',
      medicalCenter: data.medicalCenter || '',
      medicalDate: data.medicalDate || '',
      medicalNotes: data.medicalNotes || '',

      // Tracking
      tracking: defaultTracking,

      // Meta
      status: 'active',
      registeredAt: new Date().toISOString(),
      registeredBy: req.user?.email || 'admin',
      lastUpdatedAt: new Date().toISOString(),
      lastUpdatedBy: req.user?.email || 'admin',
    };

    const docRef = await db.collection(COLLECTION).add(newEmployee);
    return res.status(201).json({ success: true, data: { id: docRef.id, ...newEmployee }, message: 'Employee registered successfully.' });
  } catch (err) {
    console.error('createEmployee error:', err);
    return res.status(500).json({ success: false, message: 'Failed to register employee.' });
  }
};

/**
 * PUT /api/v1/admin/employees/:id
 * Update employee fields (partial update)
 */
const updateEmployee = async (req, res) => {
  try {
    const docRef = db.collection(COLLECTION).doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    const updates = {
      ...req.body,
      lastUpdatedAt: new Date().toISOString(),
      lastUpdatedBy: req.user?.email || 'admin',
    };

    // Remove fields that shouldn't be mass-updated
    delete updates.registeredAt;
    delete updates.registeredBy;
    delete updates.id;

    await docRef.update(updates);
    return res.status(200).json({ success: true, message: 'Employee updated successfully.' });
  } catch (err) {
    console.error('updateEmployee error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update employee.' });
  }
};

/**
 * DELETE /api/v1/admin/employees/:id
 * Delete an employee record
 */
const deleteEmployee = async (req, res) => {
  try {
    const docRef = db.collection(COLLECTION).doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    await docRef.delete();
    return res.status(200).json({ success: true, message: 'Employee deleted successfully.' });
  } catch (err) {
    console.error('deleteEmployee error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete employee.' });
  }
};

/**
 * PUT /api/v1/admin/employees/:id/medical
 * Update medical status: pass | fail | pending
 */
const updateMedicalStatus = async (req, res) => {
  try {
    const { medicalStatus, medicalCenter, medicalDate, medicalNotes } = req.body;
    if (!['pass', 'fail', 'pending'].includes(medicalStatus)) {
      return res.status(400).json({ success: false, message: 'medicalStatus must be pass, fail, or pending.' });
    }

    const docRef = db.collection(COLLECTION).doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    await docRef.update({
      medicalStatus,
      ...(medicalCenter !== undefined && { medicalCenter }),
      ...(medicalDate !== undefined && { medicalDate }),
      ...(medicalNotes !== undefined && { medicalNotes }),
      lastUpdatedAt: new Date().toISOString(),
      lastUpdatedBy: req.user?.email || 'admin',
    });

    return res.status(200).json({ success: true, message: `Medical status updated to "${medicalStatus}".` });
  } catch (err) {
    console.error('updateMedicalStatus error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update medical status.' });
  }
};

/**
 * PUT /api/v1/admin/employees/:id/tracking
 * Update one or more tracking steps
 * Body: { tracking: [ { step, completed, date, fileUrl }, ... ] }
 */
const updateTracking = async (req, res) => {
  try {
    const { tracking } = req.body;
    if (!Array.isArray(tracking)) {
      return res.status(400).json({ success: false, message: 'tracking must be an array.' });
    }

    const docRef = db.collection(COLLECTION).doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    await docRef.update({
      tracking,
      lastUpdatedAt: new Date().toISOString(),
      lastUpdatedBy: req.user?.email || 'admin',
    });

    return res.status(200).json({ success: true, message: 'Tracking updated successfully.' });
  } catch (err) {
    console.error('updateTracking error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update tracking.' });
  }
};

module.exports = {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateMedicalStatus,
  updateTracking,
};
