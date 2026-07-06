/**
 * imageCompressor.ts
 * Compresses images client-side using Canvas API.
 * Outputs a base64 JPEG string suitable for storage in Firestore
 * (target: < 800KB to stay safely under Firestore's 1MB document limit).
 *
 * No external service or paid plan required.
 */

export interface CompressOptions {
  maxWidth?: number;   // default 900px
  maxHeight?: number;  // default 900px
  quality?: number;    // 0-1, default 0.72 (~good quality, small size)
  maxSizeKB?: number;  // hard limit in KB, default 750
}

/**
 * Compresses a File image and returns a base64 JPEG data URL.
 * Automatically reduces quality if the result is still too large.
 */
export const compressImage = (
  file: File,
  opts: CompressOptions = {}
): Promise<string> => {
  const {
    maxWidth = 900,
    maxHeight = 900,
    quality = 0.72,
    maxSizeKB = 750,
  } = opts;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));

      img.onload = () => {
        let { width, height } = img;

        // Scale down proportionally if needed
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width  = Math.round(width  * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas 2D context unavailable'));

        // White background for PNGs with transparency
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Try progressively lower quality until under maxSizeKB
        let q = quality;
        let dataUrl = canvas.toDataURL('image/jpeg', q);

        while (dataUrl.length / 1024 > maxSizeKB && q > 0.2) {
          q = Math.max(0.2, q - 0.08);
          dataUrl = canvas.toDataURL('image/jpeg', q);
        }

        const finalKB = Math.round(dataUrl.length / 1024);
        if (finalKB > maxSizeKB + 50) {
          reject(
            new Error(
              `Image is too large after compression (${finalKB} KB). ` +
              `Please use a smaller image (< 4 MB original).`
            )
          );
          return;
        }

        console.log(
          `✅ Compressed "${file.name}": ${Math.round(file.size / 1024)} KB → ${finalKB} KB (q=${q.toFixed(2)})`
        );

        resolve(dataUrl);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};

/** Returns estimated KB size of a base64 string */
export const base64SizeKB = (base64: string) =>
  Math.round(base64.length / 1024);
