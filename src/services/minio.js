import axios from 'axios';

const MINIO_ENDPOINT = import.meta.env.VITE_MINIO_ENDPOINT;
const MINIO_BUCKET = import.meta.env.VITE_MINIO_BUCKET;

/**
 * Uploads a file to MinIO storage
 * @param {File} file - The file to upload
 * @param {string} fileName - Custom file name (optional)
 * @returns {Promise<{url: string|null, error: string|null}>}
 */
export const uploadFile = async (file, fileName = null) => {
  try {
    const finalFileName = fileName || `${Date.now()}-${file.name}`;
    const formData = new FormData();
    formData.append('file', file);

    // Note: This is a simplified version. In production, you'd need a backend
    // to handle the actual upload to MinIO with proper authentication.
    // For now, we'll return a placeholder URL structure
    const url = `${MINIO_ENDPOINT}/${MINIO_BUCKET}/${finalFileName}`;

    // TODO: Implement actual MinIO upload via backend API
    console.warn('MinIO upload needs backend implementation');

    return { url, error: null };
  } catch (error) {
    return { url: null, error: error.message };
  }
};

/**
 * Gets the public URL for a file in MinIO
 * @param {string} fileName - The file name in MinIO
 * @returns {string}
 */
export const getFileUrl = (fileName) => {
  return `${MINIO_ENDPOINT}/${MINIO_BUCKET}/${fileName}`;
};

/**
 * Deletes a file from MinIO storage
 * @param {string} fileName - The file name to delete
 * @returns {Promise<{error: string|null}>}
 */
export const deleteFile = async (fileName) => {
  try {
    // TODO: Implement actual MinIO delete via backend API
    console.warn('MinIO delete needs backend implementation');
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Upload image with client-side file handling
 * This is a workaround until backend MinIO integration is complete
 */
export const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // For development: return base64 data URL
      // In production, this should upload to MinIO via backend
      resolve({
        url: reader.result,
        error: null
      });
    };
    reader.onerror = () => {
      reject({
        url: null,
        error: 'Failed to read file'
      });
    };
    reader.readAsDataURL(file);
  });
};
