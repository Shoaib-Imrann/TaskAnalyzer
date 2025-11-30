"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  score?: number;
  className?: string;
}

// Score to priority mapping logic - used for color coding
export function getScorePriority(score?: number): "High" | "Medium" | "Low" {
  if (!score) return "Low";
  if (score >= 80) return "High";
  if (score >= 50) return "Medium";
  return "Low";
}

export function PriorityBadge({ score, className }: PriorityBadgeProps) {
  const priority = getScorePriority(score);

  const priorityStyles = {
    High: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    Medium:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    Low: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  };

  return (
    <Badge
      variant="outline"
      className={cn(priorityStyles[priority], className)}
    >
      {priority}
    </Badge>
  );
}
