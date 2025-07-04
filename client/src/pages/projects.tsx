import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "@/components/project-card";
import { ResultsTabs } from "@/components/results-tabs";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Zap } from "lucide-react";
import { Project } from "@/lib/types";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredProjects = projects.filter((project: Project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Projects</h1>
          <p className="text-xl text-gray-600">
            Manage and browse all your generated sparks in one place.
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2 h-12">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

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
                  ← Back to projects
                </Button>
              </div>
              <ResultsTabs project={selectedProject} />
            </CardContent>
          </Card>
        )}

        {/* Projects Grid */}
        {!selectedProject && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: Project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && !selectedProject && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "No projects found" : "No projects yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? "Try adjusting your search terms."
                  : "Create your first spark to get started."
                }
              </p>
              {!searchTerm && (
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  Create your first project
                </Button>
              )}
            </CardContent>
          </Card>
        )}
    </div>
  );
}
