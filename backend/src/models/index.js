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
  
  if (!data.title || typeof data.title !== 'string') errors.push('Job title is required.');
  if (!data.country || typeof data.country !== 'string') errors.push('Destination country is required.');
  if (!data.category || typeof data.category !== 'string') errors.push('Job category is required.');
  if (!data.deadline || typeof data.deadline !== 'string') errors.push('Application deadline is required.');
  if (!data.description || typeof data.description !== 'string') errors.push('Job description is required.');

  if (!data.salary || typeof data.salary.min !== 'number' || typeof data.salary.max !== 'number') {
    errors.push('Salary object with numeric min and max values is required.');
  }

  const title = data.title?.trim() || '';

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      title,
      slug: data.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      category: data.category?.trim(),
      tags: Array.isArray(data.tags) ? data.tags : [],
      country: data.country?.trim(),
      salary: {
        min: data.salary?.min || 0,
        max: data.salary?.max || 0,
        currency: data.salary?.currency || 'USD'
      },
      deadline: data.deadline?.trim(),
      postedAt: data.postedAt || new Date().toISOString().split('T')[0],
      isUrgent: typeof data.isUrgent === 'boolean' ? data.isUrgent : false,
      genderPreference: data.genderPreference || 'No Preference',
      ageRange: {
        min: data.ageRange?.min || 18,
        max: data.ageRange?.max || 60
      },
      description: data.description?.trim(),
      requirements: Array.isArray(data.requirements) ? data.requirements : [],
      benefits: Array.isArray(data.benefits) ? data.benefits : [],
      companyLogo: data.companyLogo || null,
      active: typeof data.active === 'boolean' ? data.active : true,
      createdAt: new Date().toISOString(),
    },
  };
};

module.exports = {
  validateContactSubmission,
  validateJobPosting,
};
