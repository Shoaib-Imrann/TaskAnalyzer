"use client";

import { Calendar, Clock, Link, Star, Trash2 } from "lucide-react";
import type { Task } from "@/app/tasks/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PriorityBadge } from "./PriorityBadge";

interface TaskListProps {
  tasks: Task[];
  onRemove: (id: string) => void;
  suggestedTaskIds: string[];
}

export function TaskList({ tasks, onRemove, suggestedTaskIds }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>
          No tasks added yet. Add a task or import from JSON to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const isSuggested = suggestedTaskIds.includes(task.id);

        return (
          <Card
            key={task.id}
            id={`task-${task.id}`}
            className={cn(
              "transition-all duration-200",
              isSuggested &&
                "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-lg">{task.title}</h3>
                    {task.score !== undefined && (
                      <PriorityBadge score={task.score} />
                    )}
                    {isSuggested && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
                        Suggested Today
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{task.estimated_hours}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>Importance: {task.importance}/10</span>
                    </div>
                    {task.dependencies.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Link className="w-4 h-4" />
                        <span>Deps: {task.dependencies.join(", ")}</span>
                      </div>
                    )}
                    {task.score !== undefined && (
                      <div className="font-medium">
                        Score: {task.score.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {task.explanation && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                      <strong>Analysis:</strong> {task.explanation}
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(task.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
