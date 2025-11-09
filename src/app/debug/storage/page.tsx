import StorageTest from '@/components/debug/StorageTest';

export default function StorageDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Storage Debug Tool
          </h1>
          <p className="text-gray-600">
            Diagnose and test Supabase Storage configuration for image uploads
          </p>
        </div>
        
        <StorageTest />
        
        <div className="mt-8 text-center">
          <a 
            href="/admin" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
}
