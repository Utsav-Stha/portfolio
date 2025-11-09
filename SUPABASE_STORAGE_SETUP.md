# Supabase Storage Setup for Project Images

This guide will help you set up Supabase Storage to enable image uploads in your portfolio admin panel.

## Prerequisites

- Supabase project already set up
- Admin access to your Supabase dashboard

## Step 1: Create Storage Bucket

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **New bucket**
5. Configure the bucket:
   - **Name**: `project-images`
   - **Public bucket**: ✅ **Enable** (so images can be accessed publicly)
   - **File size limit**: 5MB (or adjust as needed)
   - **Allowed MIME types**: Leave empty or add: `image/jpeg,image/png,image/webp,image/gif`

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies:

### 1. Enable RLS on the bucket
```sql
-- This is usually enabled by default, but verify in the Storage settings
```

### 2. Create policies for public access

Go to **Storage** > **Policies** and create these policies for the `project-images` bucket:

#### Policy 1: Allow public read access
```sql
-- Policy name: "Public read access"
-- Operation: SELECT
-- Target roles: public

CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'project-images');
```

#### Policy 2: Allow authenticated uploads
```sql
-- Policy name: "Authenticated upload access"
-- Operation: INSERT
-- Target roles: authenticated

CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'project-images');
```

#### Policy 3: Allow authenticated updates
```sql
-- Policy name: "Authenticated update access"
-- Operation: UPDATE
-- Target roles: authenticated

CREATE POLICY "Authenticated update access" ON storage.objects
FOR UPDATE USING (bucket_id = 'project-images');
```

#### Policy 4: Allow authenticated deletes
```sql
-- Policy name: "Authenticated delete access"
-- Operation: DELETE
-- Target roles: authenticated

CREATE POLICY "Authenticated delete access" ON storage.objects
FOR DELETE USING (bucket_id = 'project-images');
```

## Step 3: Verify Setup

1. Go to your admin panel in your portfolio
2. Try to add or edit a project
3. Click "Upload File" in the Project Image section
4. Select an image from your computer
5. The image should upload successfully and appear in the preview

## Troubleshooting

### Issue: "Failed to upload image"
- **Check**: Bucket name is exactly `project-images`
- **Check**: Bucket is set to public
- **Check**: RLS policies are correctly configured
- **Check**: File size is under 5MB
- **Check**: File is a valid image format

### Issue: "Image not displaying after upload"
- **Check**: Public read policy is enabled
- **Check**: Image URL is correctly formatted
- **Check**: No CORS issues (bucket should be public)

### Issue: "Permission denied"
- **Check**: You're authenticated in your app
- **Check**: Upload, update, and delete policies are set for authenticated users
- **Check**: Your Supabase client is properly configured

## File Structure

After setup, your uploaded images will be stored in this structure:
```
project-images/
└── projects/
    ├── 1699518234567-abc123.jpg
    ├── 1699518245678-def456.png
    └── ...
```

## Security Notes

- Images are publicly accessible once uploaded (by design for portfolio display)
- Only authenticated users can upload/modify/delete images
- File size is limited to 5MB to prevent abuse
- Only image file types are accepted

## Alternative: Manual Bucket Creation via SQL

If you prefer to set everything up via SQL, you can run this in the SQL Editor:

```sql
-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Create policies
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Authenticated update access" ON storage.objects
FOR UPDATE USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated delete access" ON storage.objects
FOR DELETE USING (bucket_id = 'project-images');
```

## Next Steps

Once setup is complete, you can:
1. Upload images directly from your admin panel
2. Images will be automatically optimized and served via Supabase CDN
3. Old images can be replaced, and unused images will be cleaned up
4. All image URLs will be automatically updated in your projects database

Your portfolio will now support seamless image uploads! 🎉
