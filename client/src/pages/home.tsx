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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jump-start your next creation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Generate AI-powered outlines, titles, and promotional copy for your blog posts, 
            videos, newsletters, and social campaigns in seconds.
          </p>
        </div>

        {/* Spark Generator */}
        <div className="mb-12">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <SparkGenerator 
                userId={currentUser.id} 
                onSuccess={handleProjectGenerated}
              />
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {selectedProject && (
          <div className="mb-12">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <ResultsTabs project={selectedProject} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Recent Sparks</h3>
                  <p className="text-gray-600">Your latest content creations</p>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  View all projects
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        {recentProjects.length === 0 && !selectedProject && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create your first spark
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Start generating content by filling out the form above. Your projects will appear here.
              </p>
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
