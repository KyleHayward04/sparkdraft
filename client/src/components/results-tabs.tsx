import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Star, Download, Share2, Check } from "lucide-react";
import { Project } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ResultsTabsProps {
  project: Project;
  onToggleFavorite?: () => void;
}

export function ResultsTabs({ project, onToggleFavorite }: ResultsTabsProps) {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(id));
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
      
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const content = `# ${project.title}

## Topic: ${project.topic}
## Format: ${project.format}
## Voice Profile: ${project.voiceProfile}

## Outlines
${project.outlines?.map((outline, index) => `
### ${outline.title} (~${outline.wordCount} words)
${outline.sections.map(section => `- ${section}`).join('\n')}
`).join('\n') || 'No outlines available'}

## Titles
${project.titles?.map((title, index) => `${index + 1}. ${title}`).join('\n') || 'No titles available'}

## Promotional Content
${project.promos?.map((promo, index) => `
### ${promo.platform}
${promo.content}
`).join('\n') || 'No promotional content available'}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: `Check out this content I generated: ${project.topic}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Project link copied to clipboard.",
      });
    }
  };

  if (!project.outlines && !project.titles && !project.promos) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p>Generating content...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Generated Content</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="outlines" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="outlines">Outlines</TabsTrigger>
            <TabsTrigger value="titles">Titles</TabsTrigger>
            <TabsTrigger value="promos">Promos</TabsTrigger>
          </TabsList>

          <TabsContent value="outlines" className="mt-6">
            <div className="space-y-4">
              {project.outlines?.map((outline, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{outline.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        ~{outline.wordCount} words
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleFavorite}
                        className="h-8 w-8 p-0"
                      >
                        <Star className={`h-4 w-4 ${project.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(
                          `${outline.title}\n\n${outline.sections.map(s => `• ${s}`).join('\n')}`,
                          `outline-${index}`
                        )}
                        className="h-8 w-8 p-0"
                      >
                        {copiedItems.has(`outline-${index}`) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {outline.sections.map((section, sectionIndex) => (
                      <li key={sectionIndex}>• {section}</li>
                    ))}
                  </ul>
                </div>
              )) || <div className="text-center text-gray-500">No outlines available</div>}
            </div>
          </TabsContent>

          <TabsContent value="titles" className="mt-6">
            <div className="space-y-3">
              {project.titles?.map((title, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
                  <span className="text-sm font-medium text-gray-900">{title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(title, `title-${index}`)}
                    className="h-8 w-8 p-0"
                  >
                    {copiedItems.has(`title-${index}`) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              )) || <div className="text-center text-gray-500">No titles available</div>}
            </div>
          </TabsContent>

          <TabsContent value="promos" className="mt-6">
            <div className="space-y-4">
              {project.promos?.map((promo, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {promo.platform}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(promo.content, `promo-${index}`)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedItems.has(`promo-${index}`) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700">{promo.content}</p>
                </div>
              )) || <div className="text-center text-gray-500">No promotional content available</div>}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
