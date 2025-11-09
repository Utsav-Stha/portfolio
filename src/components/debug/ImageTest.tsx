"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ImageTest = () => {
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<string>('');

  const testImageUrl = (url: string) => {
    if (!url) {
      setTestResult('Please enter an image URL');
      return;
    }

    setTestResult('Testing...');
    
    const img = new Image();
    img.onload = () => {
      setTestResult(`✅ Image loads successfully (${img.width}x${img.height})`);
    };
    img.onerror = () => {
      setTestResult('❌ Image failed to load - check URL and CORS settings');
    };
    img.src = url;
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Image URL Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Paste your Supabase image URL here"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
          />
          <Button onClick={() => testImageUrl(testUrl)}>
            Test
          </Button>
        </div>
        
        {testResult && (
          <div className={`p-3 rounded-md text-sm ${
            testResult.includes('✅') ? 'bg-green-50 text-green-700' :
            testResult.includes('❌') ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}>
            {testResult}
          </div>
        )}
        
        {testUrl && testResult.includes('✅') && (
          <div className="border rounded-md p-2">
            <img src={testUrl} alt="Test" className="max-w-full h-auto" />
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">How to get your image URL:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to Supabase Dashboard → Storage → project-images</li>
            <li>Find your uploaded image</li>
            <li>Click the "Copy URL" button</li>
            <li>Paste it here to test</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageTest;
