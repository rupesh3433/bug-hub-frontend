import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
  className?: string;
}

const severityConfig = {
  critical: {
    label: 'Critical',
    className: 'bg-severity-critical text-white border-severity-critical',
  },
  high: {
    label: 'High',
    className: 'bg-severity-high text-white border-severity-high',
  },
  medium: {
    label: 'Medium',
    className: 'bg-severity-medium text-black border-severity-medium',
  },
  low: {
    label: 'Low',
    className: 'bg-severity-low text-white border-severity-low',
  },
};

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity] || severityConfig.medium;
  
  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}