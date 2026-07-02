/**
 * Foundational Data Validation & Schema Structuring Layer
 * Ensures payload structure and required fields before reading/writing to Firestore collections.
 */

const validateContactSubmission = (data) => {
  const errors = [];
  if (!data.name || typeof data.name !== 'string') errors.push('Name is required and must be a valid string.');
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) errors.push('Valid email address is required.');
  if (!data.message || typeof data.message !== 'string') errors.push('Message content is required.');
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      destinationOfInterest: data.destinationOfInterest || 'General Inquiry',
      message: data.message?.trim(),
      submittedAt: new Date().toISOString(),
      status: 'new',
    },
  };
};

const validateJobPosting = (data) => {
  const errors = [];
  if (!data.title) errors.push('Job title is required.');
  if (!data.country) errors.push('Destination country is required.');
  if (!data.category) errors.push('Job category is required.');

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      title: data.title?.trim(),
      country: data.country?.trim(),
      category: data.category?.trim(),
      salary: data.salary || 'Negotiable',
      requirements: Array.isArray(data.requirements) ? data.requirements : [],
      active: typeof data.active === 'boolean' ? data.active : true,
      createdAt: new Date().toISOString(),
    },
  };
};

module.exports = {
  validateContactSubmission,
  validateJobPosting,
};
