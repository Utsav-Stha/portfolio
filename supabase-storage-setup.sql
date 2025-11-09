-- Run this SQL in your Supabase SQL Editor to set up the storage bucket and policies
-- Go to: Dashboard > SQL Editor > New query

-- 1. Create the bucket (if not created via UI)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images', 
  'project-images', 
  true, 
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
);

-- 2. Enable RLS (Row Level Security)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create policy for public read access (so images show on your portfolio)
CREATE POLICY "Public read access for project images" ON storage.objects
FOR SELECT USING (bucket_id = 'project-images');

-- 4. Create policy for authenticated upload (so you can upload from admin panel)
CREATE POLICY "Authenticated upload for project images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);

-- 5. Create policy for authenticated update (so you can replace images)
CREATE POLICY "Authenticated update for project images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);

-- 6. Create policy for authenticated delete (so you can remove images)
CREATE POLICY "Authenticated delete for project images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);

-- Verify the setup
SELECT * FROM storage.buckets WHERE id = 'project-images';
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%project images%';
