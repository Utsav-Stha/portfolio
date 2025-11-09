import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload an image file to Supabase Storage
 * @param file - The image file to upload
 * @param bucket - The storage bucket name (default: 'project-images')
 * @returns Promise with upload result containing success status and URL or error
 */
export const uploadImage = async (
  file: File, 
  bucket: string = 'project-images'
): Promise<UploadResult> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Please select a valid image file'
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'Image size must be less than 5MB'
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    console.error('Unexpected error during upload:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during upload'
    };
  }
};

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The full URL of the image to delete
 * @param bucket - The storage bucket name (default: 'project-images')
 * @returns Promise with deletion result
 */
export const deleteImage = async (
  imageUrl: string, 
  bucket: string = 'project-images'
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === bucket);
    
    if (bucketIndex === -1) {
      return {
        success: false,
        error: 'Invalid image URL format'
      };
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/');

    // Delete file from Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };

  } catch (error) {
    console.error('Unexpected error during deletion:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during deletion'
    };
  }
};

/**
 * Validate image file before upload
 * @param file - The file to validate
 * @returns Validation result with success status and error message if any
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'Please select a valid image file (PNG, JPG, JPEG, WebP, etc.)'
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size must be less than 5MB'
    };
  }

  // Check image dimensions (optional - you can adjust these limits)
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Optional: Check minimum dimensions
      if (img.width < 200 || img.height < 200) {
        resolve({
          valid: false,
          error: 'Image must be at least 200x200 pixels'
        });
      } else {
        resolve({ valid: true });
      }
    };
    img.onerror = () => {
      resolve({
        valid: false,
        error: 'Invalid image file'
      });
    };
    img.src = URL.createObjectURL(file);
  }) as any;
};
