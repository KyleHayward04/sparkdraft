import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

interface QuotaIndicatorProps {
  sparksUsed: number;
  sparksLimit: number;
  className?: string;
}

export function QuotaIndicator({ sparksUsed, sparksLimit, className }: QuotaIndicatorProps) {
  const isNearLimit = sparksUsed >= sparksLimit * 0.8;
  const isAtLimit = sparksUsed >= sparksLimit;

  return (
    <Badge 
      variant={isAtLimit ? "destructive" : isNearLimit ? "secondary" : "default"}
      className={className}
    >
      <Flame className="h-4 w-4 mr-1" />
      {sparksUsed}/{sparksLimit} Sparks
    </Badge>
  );
}
