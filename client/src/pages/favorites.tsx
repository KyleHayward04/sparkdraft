import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "@/components/project-card";
import { ResultsTabs } from "@/components/results-tabs";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Star } from "lucide-react";
import { Project } from "@/lib/types";

export default function Favorites() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentUser] = useState({ id: 1 }); // Mock user - replace with actual auth

  const { data: favorites = [] } = useQuery({
    queryKey: ["/api/favorites"],
    queryFn: async () => {
      const response = await fetch("/api/favorites", {
        headers: { "user-id": currentUser.id.toString() }
      });
      return response.json();
    }
  });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Favorites</h2>
          <p className="text-gray-600">
            Quick access to your starred projects and content.
          </p>
        </div>

        {/* Results Section */}
        {selectedProject && (
          <div className="mb-8">
            <div className="mb-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedProject(null)}
                className="text-primary hover:text-primary/80"
              >
                ← Back to favorites
              </Button>
            </div>
            <ResultsTabs project={selectedProject} />
          </div>
        )}

        {/* Favorites Grid */}
        {!selectedProject && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((project: Project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 && !selectedProject && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-500">
                  Star your best sparks to find them quickly here.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
