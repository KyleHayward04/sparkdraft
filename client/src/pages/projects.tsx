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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Projects</h2>
          <p className="text-gray-600">
            Manage and browse all your generated sparks in one place.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
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
                ← Back to projects
              </Button>
            </div>
            <ResultsTabs project={selectedProject} />
          </div>
        )}

        {/* Projects Grid */}
        {!selectedProject && (
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
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No projects found" : "No projects yet"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? "Try adjusting your search terms."
                    : "Create your first spark to get started."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
