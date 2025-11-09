"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/imageUpload';

const StorageTest = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSupabaseConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔄 Testing Supabase connection...');
      
      // Test 1: Check if we can connect to Supabase
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError) {
        addResult(`❌ Auth error: ${authError.message}`);
      } else {
        addResult(`✅ Auth status: ${user.user ? 'Authenticated' : 'Not authenticated'}`);
      }

      // Test 2: List available buckets
      addResult('🔄 Checking available storage buckets...');
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        addResult(`❌ Buckets error: ${bucketsError.message}`);
      } else {
        addResult(`✅ Available buckets: ${buckets?.map(b => b.id).join(', ') || 'None'}`);
        
        // Check if project-images bucket exists
        const projectImagesBucket = buckets?.find(b => b.id === 'project-images');
        if (projectImagesBucket) {
          addResult(`✅ project-images bucket found (public: ${projectImagesBucket.public})`);
        } else {
          addResult('❌ project-images bucket NOT found');
        }
      }

      // Test 3: Try to list files in project-images bucket (if it exists)
      if (buckets?.some(b => b.id === 'project-images')) {
        addResult('🔄 Testing bucket access...');
        const { data: files, error: filesError } = await supabase.storage
          .from('project-images')
          .list('projects', { limit: 5 });
          
        if (filesError) {
          addResult(`❌ Bucket access error: ${filesError.message}`);
        } else {
          addResult(`✅ Bucket accessible, found ${files?.length || 0} files in projects folder`);
        }
      }

      // Test 4: Check projects table access
      addResult('🔄 Testing database access...');
      const { data: projects, error: dbError } = await supabase
        .from('projects')
        .select('id, title')
        .limit(1);
        
      if (dbError) {
        addResult(`❌ Database error: ${dbError.message}`);
      } else {
        addResult(`✅ Database accessible, found ${projects?.length || 0} projects`);
      }

    } catch (error) {
      addResult(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testImageUpload = async () => {
    // Create a small test image file
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#4F46E5';
      ctx.fillRect(0, 0, 100, 100);
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText('Test', 35, 55);
    }

    canvas.toBlob(async (blob) => {
      if (!blob) {
        addResult('❌ Failed to create test image');
        return;
      }

      const testFile = new File([blob], 'test-image.png', { type: 'image/png' });
      addResult(`🔄 Testing upload with ${testFile.name} (${testFile.size} bytes)`);

      try {
        const result = await uploadImage(testFile);
        if (result.success) {
          addResult(`✅ Upload successful! URL: ${result.url}`);
        } else {
          addResult(`❌ Upload failed: ${result.error}`);
        }
      } catch (error) {
        addResult(`❌ Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, 'image/png');
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Supabase Storage Diagnostic Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testSupabaseConnection}
            disabled={isLoading}
          >
            Test Connection & Setup
          </Button>
          <Button 
            onClick={testImageUpload}
            disabled={isLoading}
            variant="outline"
          >
            Test Image Upload
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="space-y-1 font-mono text-sm">
              {testResults.map((result, index) => (
                <div key={index} className={`${
                  result.includes('❌') ? 'text-red-600' : 
                  result.includes('✅') ? 'text-green-600' : 
                  'text-blue-600'
                }`}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="font-medium mb-1">Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Test Connection & Setup" to diagnose Supabase configuration</li>
            <li>If the bucket doesn't exist, create it using the SQL setup file</li>
            <li>Click "Test Image Upload" to test the actual upload functionality</li>
            <li>Check the browser console for additional error details</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageTest;
