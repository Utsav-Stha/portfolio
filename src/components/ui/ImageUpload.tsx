"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { uploadImage, deleteImage, type UploadResult } from '@/lib/imageUpload';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const ImageUpload = ({ 
  currentImageUrl = '', 
  onImageChange, 
  label = 'Project Image',
  placeholder = 'https://example.com/image.jpg or upload a file',
  disabled = false
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);
  const [urlInput, setUrlInput] = useState<string>(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const result: UploadResult = await uploadImage(file);
      
      if (result.success && result.url) {
        setPreviewUrl(result.url);
        setUrlInput(result.url);
        onImageChange(result.url);
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError('An unexpected error occurred');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    setPreviewUrl(url);
    onImageChange(url);
    setUploadError(null);
  };

  const handleRemoveImage = async () => {
    if (previewUrl && previewUrl.includes('supabase')) {
      // Only try to delete if it's a Supabase-hosted image
      try {
        await deleteImage(previewUrl);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    
    setPreviewUrl('');
    setUrlInput('');
    onImageChange('');
    setUploadError(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload">{label}</Label>
      
      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          id="image-upload"
          type="url"
          value={urlInput}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isUploading}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileInput}
          disabled={disabled || isUploading}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload File
            </>
          )}
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload Error */}
      {uploadError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {uploadError}
        </div>
      )}

      {/* Image Preview */}
      {previewUrl && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={() => {
                  setUploadError('Failed to load image. Please check the URL or try uploading a different file.');
                  setPreviewUrl('');
                }}
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => window.open(previewUrl, '_blank')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Full
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={handleRemoveImage}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Instructions */}
      {!previewUrl && (
        <div className="text-sm text-muted-foreground bg-muted/50 border border-muted rounded-md p-3">
          <div className="flex items-start gap-2">
            <ImageIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Image Upload Options:</p>
              <ul className="space-y-1 text-xs">
                <li>• Paste an image URL in the input field above</li>
                <li>• Click "Upload File" to select an image from your computer</li>
                <li>• Supported formats: PNG, JPG, JPEG, WebP, GIF</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Recommended dimensions: at least 400x300 pixels</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
