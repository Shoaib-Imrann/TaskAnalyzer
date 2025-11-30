"use client";

import { useState } from "react";
import type { Task } from "@/app/tasks/page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BulkImportProps {
  onLoad: (tasks: Task[]) => void;
}

export function BulkImport({ onLoad }: BulkImportProps) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLoad = () => {
    if (!jsonText.trim()) {
      setError("Please enter JSON data");
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);

      if (!Array.isArray(parsed)) {
        setError("JSON must be an array of tasks");
        return;
      }

      // Validate task structure
      const tasks: Task[] = parsed.map((item, index) => {
        if (
          !item.title ||
          !item.due_date ||
          !item.estimated_hours ||
          !item.importance
        ) {
          throw new Error(`Task at index ${index} is missing required fields`);
        }

        return {
          id: item.id || Date.now().toString() + index,
          title: item.title,
          due_date: item.due_date,
          estimated_hours: Number(item.estimated_hours),
          importance: Number(item.importance),
          dependencies: Array.isArray(item.dependencies)
            ? item.dependencies
            : [],
          score: item.score,
          explanation: item.explanation,
        };
      });

      onLoad(tasks);
      setJsonText("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="json-input" className="text-gray-400">
        JSON Tasks
      </Label>
      <div className="flex flex-col md:flex-row gap-2 md:items-start">
        <Textarea
          id="json-input"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={`[
          {
            "title": "Complete project",
            "due_date": "2025-11-27",
            "estimated_hours": 8,
            "importance": 9,
            "dependencies": []
          }
          ]`}
          className="min-h-[120px] font-mono text-sm flex-1 placeholder:text-gray-300"
        />
        <Button onClick={handleLoad} className="w-full md:w-auto md:mt-0">
          Load JSON
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
