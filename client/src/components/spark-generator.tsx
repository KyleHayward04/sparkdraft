import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, FileText, Video, Mail, Image } from "lucide-react";
import { ContentFormat, VoiceProfile } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SparkGeneratorProps {
  userId: number;
  onSuccess?: (projectId: number) => void;
}

export function SparkGenerator({ userId, onSuccess }: SparkGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState<ContentFormat>("blog");
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile>("professional");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      topic: string;
      format: string;
      voiceProfile: string;
    }) => {
      const response = await apiRequest("POST", "/api/projects", data, {
        headers: { "user-id": userId.toString() }
      });
      return response.json();
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/quota"] });
      toast({
        title: "Spark Generated!",
        description: "Your content has been generated successfully.",
      });
      setTopic("");
      if (onSuccess) {
        onSuccess(project.id);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    generateMutation.mutate({
      title: topic,
      topic,
      format,
      voiceProfile,
    });
  };

  const formatOptions = [
    { value: "blog", label: "Blog", icon: FileText },
    { value: "video", label: "Video", icon: Video },
    { value: "newsletter", label: "Newsletter", icon: Mail },
    { value: "carousel", label: "Carousel", icon: Image },
  ];

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">New Spark</h3>
          <Wand2 className="h-5 w-5 text-primary" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="topic" className="text-sm font-medium text-gray-700 mb-2">
              What's your topic?
            </Label>
            <Input
              id="topic"
              placeholder="e.g., Remote work productivity tips"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3">
              Choose format
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormat(option.value as ContentFormat)}
                  className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                    format === option.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <option.icon className="h-5 w-5 mb-2" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3">
              Voice profile
            </Label>
            <Select value={voiceProfile} onValueChange={(value) => setVoiceProfile(value as VoiceProfile)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="witty">Witty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!topic.trim() || generateMutation.isPending}
          >
            {generateMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Spark It!
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
