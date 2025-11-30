"use client";

import { Trash2 } from "lucide-react";
import type { Task } from "@/app/tasks/page";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "./PriorityBadge";

interface TaskListProps {
  tasks: Task[];
  onRemove: (id: string) => void;
  suggestedTaskIds: string[];
}

export function TaskList({ tasks, onRemove, suggestedTaskIds }: TaskListProps) {
  if (tasks.length === 0) {
    return <div className="text-gray-500 py-4">No tasks added yet.</div>;
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const isSuggested = suggestedTaskIds.includes(task.id);

        return (
          <div
            key={task.id}
            id={`task-${task.id}`}
            className={`p-3 border ${isSuggested ? "bg-blue-50 border-blue-200" : "bg-white"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">{task.title}</h3>
                  {!isSuggested && task.score !== undefined && (
                    <PriorityBadge score={task.score} />
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    {new Date(task.due_date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>{task.estimated_hours}h</span>
                  <span>Importance: {task.importance}/10</span>
                  {task.dependencies.length > 0 && (
                    <span>Deps: {task.dependencies.join(", ")}</span>
                  )}
                  {!isSuggested && task.score !== undefined && (
                    <span className="font-medium">
                      Score: {task.score.toFixed(1)}
                    </span>
                  )}
                </div>

                {!isSuggested && task.explanation && (
                  <div className="mt-2 text-sm text-gray-700">
                    {task.explanation}
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(task.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
