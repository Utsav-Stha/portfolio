"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

const DatabaseTest = () => {
  const [projectId, setProjectId] = useState('90c4269e-b5a3-41f5-9f89-7faf028291b5'); // JHPL LOS ID
  const [newImageUrl, setNewImageUrl] = useState('');
  const [testResult, setTestResult] = useState<string>('');

  const testDirectUpdate = async () => {
    if (!projectId || !newImageUrl) {
      setTestResult('Please enter both project ID and new image URL');
      return;
    }

    setTestResult('Testing direct database update...');
    
    try {
      // First, check current data
      const { data: currentData, error: fetchError } = await supabase
        .from('projects')
        .select('id, title, image_url')
        .eq('id', projectId)
        .single();

      if (fetchError) {
        setTestResult(`❌ Fetch error: ${fetchError.message}`);
        return;
      }

      console.log('Current data:', currentData);

      // Try to update
      const { data: updateData, error: updateError } = await supabase
        .from('projects')
        .update({ 
          image_url: newImageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select();

      if (updateError) {
        setTestResult(`❌ Update error: ${updateError.message}`);
        console.error('Update error details:', updateError);
        return;
      }

      console.log('Update result:', updateData);

      // Verify the update
      const { data: verifyData, error: verifyError } = await supabase
        .from('projects')
        .select('id, title, image_url, updated_at')
        .eq('id', projectId)
        .single();

      if (verifyError) {
        setTestResult(`❌ Verification error: ${verifyError.message}`);
        return;
      }

      console.log('Verification data:', verifyData);

      if (verifyData.image_url === newImageUrl) {
        setTestResult(`✅ Success! Image URL updated to: ${verifyData.image_url}`);
      } else {
        setTestResult(`❌ Update failed. Expected: ${newImageUrl}, Got: ${verifyData.image_url}`);
      }

    } catch (error) {
      setTestResult(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Test error:', error);
    }
  };

  const getCurrentData = async () => {
    if (!projectId) {
      setTestResult('Please enter project ID');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, image_url, updated_at')
        .eq('id', projectId)
        .single();

      if (error) {
        setTestResult(`❌ Error: ${error.message}`);
        return;
      }

      setTestResult(`Current data: ${JSON.stringify(data, null, 2)}`);
      console.log('Current project data:', data);
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Database Update Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Project ID:</label>
          <Input
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Enter project ID"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">New Image URL:</label>
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Enter new Supabase image URL"
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={getCurrentData}>
            Get Current Data
          </Button>
          <Button onClick={testDirectUpdate} variant="outline">
            Test Update
          </Button>
        </div>
        
        {testResult && (
          <div className={`p-3 rounded-md text-sm whitespace-pre-wrap ${
            testResult.includes('✅') ? 'bg-green-50 text-green-700' :
            testResult.includes('❌') ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}>
            {testResult}
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>The project ID is pre-filled with JHPL LOS ID</li>
            <li>Enter a Supabase image URL (from your uploads)</li>
            <li>Click "Get Current Data" to see what's in the database</li>
            <li>Click "Test Update" to try updating directly</li>
            <li>Check browser console for detailed logs</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseTest;
