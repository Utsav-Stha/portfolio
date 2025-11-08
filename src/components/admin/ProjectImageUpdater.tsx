"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProjectImages, setManualAppIcons } from "@/lib/extractProjectImages";
import { Loader2, Download, RefreshCw } from "lucide-react";

const ProjectImageUpdater = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isManualUpdating, setIsManualUpdating] = useState(false);
  const [updateLog, setUpdateLog] = useState<string[]>([]);

  const handleAutoUpdate = async () => {
    setIsUpdating(true);
    setUpdateLog([]);
    
    try {
      // Override console.log to capture logs
      const originalLog = console.log;
      console.log = (message: string) => {
        setUpdateLog(prev => [...prev, message]);
        originalLog(message);
      };

      await updateProjectImages();
      setUpdateLog(prev => [...prev, "✅ Auto-update completed successfully!"]);
    } catch (error) {
      setUpdateLog(prev => [...prev, `❌ Error: ${error}`]);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleManualUpdate = async () => {
    setIsManualUpdating(true);
    setUpdateLog([]);
    
    try {
      await setManualAppIcons();
      setUpdateLog(prev => [...prev, "✅ Manual update completed successfully!"]);
    } catch (error) {
      setUpdateLog(prev => [...prev, `❌ Error: ${error}`]);
    } finally {
      setIsManualUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Project Image Updater
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Extract and update project images from Play Store links. Choose between automatic extraction or manual updates with predefined images.
          </p>
          
          <div className="flex gap-4">
            <Button
              onClick={handleAutoUpdate}
              disabled={isUpdating || isManualUpdating}
              className="flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Auto Extract Images
                </>
              )}
            </Button>

            <Button
              onClick={handleManualUpdate}
              disabled={isUpdating || isManualUpdating}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isManualUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Use Manual Images
                </>
              )}
            </Button>
          </div>

          {updateLog.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Update Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {updateLog.map((log, index) => (
                    <div key={index} className="text-sm font-mono bg-muted p-2 rounded">
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <div>
            <strong>Auto Extract Images:</strong> Attempts to automatically extract app icons from Play Store pages. This method may not always work due to CORS restrictions.
          </div>
          <div>
            <strong>Use Manual Images:</strong> Uses predefined high-quality app icon URLs. This is more reliable but requires manual setup of image URLs.
          </div>
          <div>
            <strong>Note:</strong> After updating, refresh your projects page to see the changes.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectImageUpdater;
