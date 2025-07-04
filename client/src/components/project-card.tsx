import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, FileText, Video, Mail, Image } from "lucide-react";
import { Project } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const queryClient = useQueryClient();
  
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/projects/${project.id}`, {
        isFavorite: !project.isFavorite
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    }
  });

  const formatIcons = {
    blog: FileText,
    video: Video,
    newsletter: Mail,
    carousel: Image,
  };

  const formatColors = {
    blog: "bg-blue-100 text-blue-800",
    video: "bg-green-100 text-green-800",
    newsletter: "bg-purple-100 text-purple-800",
    carousel: "bg-orange-100 text-orange-800",
  };

  const Icon = formatIcons[project.format as keyof typeof formatIcons] || FileText;
  const colorClass = formatColors[project.format as keyof typeof formatColors] || "bg-gray-100 text-gray-800";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteMutation.mutate();
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge className={`text-xs ${colorClass}`}>
            {project.format.charAt(0).toUpperCase() + project.format.slice(1)}
          </Badge>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteClick}
              className="h-8 w-8 p-0"
            >
              <Star 
                className={`h-4 w-4 ${project.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
              />
            </Button>
          </div>
        </div>
        
        <h4 className="font-medium text-gray-900 mb-1">{project.title}</h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.topic}</p>
        
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500">
            {project.outlines?.length || 0} outlines, {project.titles?.length || 0} titles
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
