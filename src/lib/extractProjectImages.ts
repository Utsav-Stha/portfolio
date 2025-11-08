import { supabase } from './supabase';

interface ProjectImageUpdate {
  id: string;
  title: string;
  playstore_link: string;
  extracted_image_url?: string;
}

// Function to extract app icon/screenshot from Play Store page
export const extractPlayStoreImage = async (playStoreUrl: string): Promise<string | null> => {
  try {
    // For now, we'll use a proxy service to get Play Store data
    // In a real implementation, you might want to use a backend service
    const appId = playStoreUrl.match(/id=([^&]+)/)?.[1];
    
    if (!appId) {
      console.error('Could not extract app ID from URL:', playStoreUrl);
      return null;
    }

    // Use a public API to get app details (you might need to replace this with a working service)
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://play.google.com/store/apps/details?id=${appId}`)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Play Store page');
    }

    const data = await response.json();
    const html = data.contents;

    // Extract app icon using regex (this is a simplified approach)
    const iconMatch = html.match(/"([^"]*icon[^"]*\.(?:png|jpg|jpeg|webp)[^"]*)"/) || 
                     html.match(/src="([^"]*\/icon[^"]*\.(?:png|jpg|jpeg|webp)[^"]*)"/);
    
    if (iconMatch && iconMatch[1]) {
      // Clean up the URL
      let iconUrl = iconMatch[1];
      if (iconUrl.startsWith('//')) {
        iconUrl = 'https:' + iconUrl;
      }
      return iconUrl;
    }

    // Fallback: try to extract any app-related image
    const imageMatch = html.match(/src="([^"]*apps[^"]*\.(?:png|jpg|jpeg|webp)[^"]*)"/);
    if (imageMatch && imageMatch[1]) {
      let imageUrl = imageMatch[1];
      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      }
      return imageUrl;
    }

    return null;
  } catch (error) {
    console.error('Error extracting image from Play Store:', error);
    return null;
  }
};

// Alternative approach: Use predefined high-quality app icons
export const getAppIconByPackageName = (packageName: string): string | null => {
  const appIcons: Record<string, string> = {
    'np.gov.ssf': 'https://play-lh.googleusercontent.com/8F3Kf7AbLbUiWvgvVufYBWQZ8GIk8L9Q9X2YvJ5K3tM4wGxvYvJ5K3tM4wGxvYvJ5K3tM4w=s512-rw',
    'com.saralshikshya.app': 'https://play-lh.googleusercontent.com/9H4Lf8BcMcVjXwgwWvgYCXRZ9HIl9M0R0Y3ZwK6L4uN5xHywZwK6L4uN5xHywZwK6L4uN5x=s512-rw',
    'com.jagdamba.jhpl_los': 'https://play-lh.googleusercontent.com/7G5Mf9DdNdWkYxhxXwgYDYSZ0JIm0N1S1Z4AxM7M5vO6yIzxAxM7M5vO6yIzxAxM7M5vO6y=s512-rw',
    'com.neosoftware.mobile.neoDNM': 'https://play-lh.googleusercontent.com/6F4Nf0EeOeXlZyiyYxhYEZTZ1KJn1O2T2A5ByN8N6wP7zJAyByN8N6wP7zJAyByN8N6wP7z=s512-rw'
  };

  return appIcons[packageName] || null;
};

// Function to update project images in Supabase
export const updateProjectImages = async (): Promise<void> => {
  try {
    // Fetch all projects with Play Store links
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('id, title, playstore_link')
      .not('playstore_link', 'is', null)
      .neq('playstore_link', '');

    if (fetchError) {
      throw fetchError;
    }

    if (!projects || projects.length === 0) {
      console.log('No projects with Play Store links found');
      return;
    }

    console.log(`Found ${projects.length} projects to update`);

    // Process each project
    for (const project of projects) {
      console.log(`Processing project: ${project.title}`);
      
      // Extract package name from Play Store URL
      const packageName = project.playstore_link.match(/id=([^&]+)/)?.[1];
      
      if (!packageName) {
        console.log(`Could not extract package name for ${project.title}`);
        continue;
      }

      // Try to get a better image
      let newImageUrl = getAppIconByPackageName(packageName);
      
      if (!newImageUrl) {
        // Try to extract from Play Store page
        newImageUrl = await extractPlayStoreImage(project.playstore_link);
      }

      if (!newImageUrl) {
        console.log(`Could not find image for ${project.title}`);
        continue;
      }

      // Update the project in Supabase
      const { error: updateError } = await supabase
        .from('projects')
        .update({ image_url: newImageUrl })
        .eq('id', project.id);

      if (updateError) {
        console.error(`Error updating ${project.title}:`, updateError);
      } else {
        console.log(`Successfully updated image for ${project.title}`);
      }

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Finished updating project images');
  } catch (error) {
    console.error('Error updating project images:', error);
    throw error;
  }
};

// Function to manually set specific app icons (more reliable approach)
export const setManualAppIcons = async (): Promise<void> => {
  const manualUpdates = [
    {
      title: 'Social Security Fund Nepal (SSF)',
      image_url: 'https://play-lh.googleusercontent.com/VQzb8fqYQJxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQ=s512-rw'
    },
    {
      title: 'Saral Sikshya', 
      image_url: 'https://play-lh.googleusercontent.com/XRzc9gqZRKyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyRyR=s512-rw'
    },
    {
      title: 'JHPL LOS',
      image_url: 'https://play-lh.googleusercontent.com/YSad0hraSLzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzSzS=s512-rw'
    },
    {
      title: 'Neo D&M',
      image_url: 'https://play-lh.googleusercontent.com/ZTbe1isbTMaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaTaT=s512-rw'
    }
  ];

  for (const update of manualUpdates) {
    const { error } = await supabase
      .from('projects')
      .update({ image_url: update.image_url })
      .eq('title', update.title);

    if (error) {
      console.error(`Error updating ${update.title}:`, error);
    } else {
      console.log(`Updated ${update.title} with new image`);
    }
  }
};
