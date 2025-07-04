import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "@/components/project-card";
import { ResultsTabs } from "@/components/results-tabs";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Star, Heart } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Favorites</h1>
          <p className="text-xl text-gray-600">
            Quick access to your starred projects and content.
          </p>
        </div>

        {/* Results Section */}
        {selectedProject && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardContent className="p-8">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedProject(null)}
                  className="text-primary hover:text-primary/80"
                >
                  ← Back to favorites
                </Button>
              </div>
              <ResultsTabs project={selectedProject} />
            </CardContent>
          </Card>
        )}

        {/* Favorites Grid */}
        {!selectedProject && favorites.length > 0 && (
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
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 mb-4">
                Star your best sparks to find them quickly here.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/projects'}>
                Browse your projects
              </Button>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
