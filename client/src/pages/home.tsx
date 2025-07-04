import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SparkGenerator } from "@/components/spark-generator";
import { ResultsTabs } from "@/components/results-tabs";
import { ProjectCard } from "@/components/project-card";
import { QuotaIndicator } from "@/components/quota-indicator";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { Project } from "@/lib/types";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentUser] = useState({ id: 1 }); // Mock user - replace with actual auth

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects", {
        headers: { "user-id": currentUser.id.toString() }
      });
      return response.json();
    }
  });

  const { data: quota } = useQuery({
    queryKey: ["/api/user/quota"],
    queryFn: async () => {
      const response = await fetch("/api/user/quota", {
        headers: { "user-id": currentUser.id.toString() }
      });
      return response.json();
    }
  });

  const handleProjectGenerated = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const recentProjects = projects.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Jump-start your next creation
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate AI-powered outlines, titles, and promo copy for your blog posts, 
            videos, newsletters, and social campaigns.
          </p>
        </div>

        {/* Spark Generator */}
        <div className="mb-8">
          <SparkGenerator 
            userId={currentUser.id} 
            onSuccess={handleProjectGenerated}
          />
        </div>

        {/* Results Section */}
        {selectedProject && (
          <div className="mb-8">
            <ResultsTabs project={selectedProject} />
          </div>
        )}

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Recent Sparks</h3>
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleProjectClick(project)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sparks yet
            </h3>
            <p className="text-gray-500">
              Create your first spark by entering a topic above.
            </p>
          </div>
        )}
    </div>
  );
}
