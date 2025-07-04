import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

interface QuotaIndicatorProps {
  sparksUsed: number;
  sparksLimit: number;
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
}

export function QuotaIndicator({ sparksUsed, sparksLimit, className, onClick, clickable = false }: QuotaIndicatorProps) {
  const isNearLimit = sparksUsed >= sparksLimit * 0.8;
  const isAtLimit = sparksUsed >= sparksLimit;

  return (
    <Badge 
      variant={isAtLimit ? "destructive" : isNearLimit ? "secondary" : "default"}
      className={`${className} ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      onClick={onClick}
    >
      <Flame className="h-4 w-4 mr-1" />
      {sparksUsed}/{sparksLimit} Sparks
    </Badge>
  );
}
