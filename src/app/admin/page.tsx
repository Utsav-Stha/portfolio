import ProjectImageUpdater from "@/components/admin/ProjectImageUpdater";
import ProfileManager from "@/components/admin/ProfileManager";
import ExperienceManager from "@/components/admin/ExperienceManager";
import ProjectsManager from "@/components/admin/ProjectsManager";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Portfolio Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Manage your portfolio content and settings
          </p>
        </div>
        
        <div className="space-y-8">
          <ProfileManager />
          <ExperienceManager />
          <ProjectsManager />
          <ProjectImageUpdater />
        </div>
      </div>
    </div>
  );
}
