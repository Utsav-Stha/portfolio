import { supabase } from './supabase';

export const downloadCV = async () => {
  try {
    // Download the CV file from Supabase Storage
    const { data, error } = await supabase.storage
      .from('documents')
      .download('cv/Utsav_Shrestha_CV.pdf');

    if (error) {
      console.error('Error downloading CV:', error);
      throw error;
    }

    // Create a blob URL and trigger download
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Utsav_Shrestha_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Failed to download CV:', error);
    return false;
  }
};

export const getCV = async () => {
  try {
    // Get the public URL for the CV
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl('cv/Utsav_Shrestha_CV.pdf');

    return data.publicUrl;
  } catch (error) {
    console.error('Failed to get CV URL:', error);
    return null;
  }
};
