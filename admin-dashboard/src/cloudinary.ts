/**
 * cloudinary.ts
 * Free image hosting via Cloudinary — replaces Firebase Storage.
 * Free tier: 25 GB storage + 25 GB bandwidth / month.
 *
 * Setup:
 *  1. Create a free account at https://cloudinary.com/
 *  2. In your Cloudinary Dashboard → Settings → Upload → Upload presets
 *     → "Add upload preset" → set Signing mode to "Unsigned" → save
 *  3. Copy your Cloud Name (top-left of dashboard) and the preset name
 *  4. Add to .env:
 *       VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *       VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

export const isCloudinaryConfigured = (): boolean =>
  Boolean(CLOUD_NAME && UPLOAD_PRESET && CLOUD_NAME !== 'YOUR_CLOUD_NAME');

/**
 * Uploads a File to Cloudinary and returns the secure CDN URL.
 * Uses unsigned upload — no backend or API secret required.
 */
export const uploadToCloudinary = async (
  file: File,
  folder = 'gallery'
): Promise<string> => {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured.\n\n' +
      'Add to your .env file:\n' +
      '  VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name\n' +
      '  VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset\n\n' +
      'Get these from: https://cloudinary.com/console'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error?.error?.message ?? `Cloudinary upload failed (HTTP ${response.status})`
    );
  }

  const data = await response.json();
  return data.secure_url as string;
};
