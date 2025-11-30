"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TaskFormData {
  title: string;
  due_date: string;
  estimated_hours: number;
  importance: number;
  dependencies: string[];
}

interface TaskFormProps {
  onSubmit: (task: TaskFormData) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    due_date: "",
    estimated_hours: 1,
    importance: 5,
    dependencies: [],
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof TaskFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.due_date) {
      newErrors.due_date = "Due date is required";
    }

    if (formData.estimated_hours <= 0) {
      newErrors.estimated_hours = "Estimated hours must be greater than 0";
    }

    if (formData.importance < 1 || formData.importance > 10) {
      newErrors.importance = "Importance must be between 1 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        title: "",
        due_date: "",
        estimated_hours: 1,
        importance: 5,
        dependencies: [],
      });
      setErrors({});
    }
  };

  const handleDependenciesChange = (value: string) => {
    // Parse comma-separated IDs and filter out empty strings
    const deps = value
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
    setFormData((prev) => ({ ...prev, dependencies: deps }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Enter task title"
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">Due Date *</Label>
        <Input
          id="due_date"
          type="date"
          value={formData.due_date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, due_date: e.target.value }))
          }
          className={errors.due_date ? "border-destructive" : ""}
        />
        {errors.due_date && (
          <p className="text-sm text-destructive">{errors.due_date}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimated_hours">Estimated Hours *</Label>
          <Input
            id="estimated_hours"
            type="number"
            min="0.5"
            step="0.5"
            value={formData.estimated_hours}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                estimated_hours: parseFloat(e.target.value) || 0,
              }))
            }
            className={errors.estimated_hours ? "border-destructive" : ""}
          />
          {errors.estimated_hours && (
            <p className="text-sm text-destructive">{errors.estimated_hours}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="importance">Importance (1-10) *</Label>
          <Input
            id="importance"
            type="number"
            min="1"
            max="10"
            value={formData.importance}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                importance: parseInt(e.target.value, 10) || 5,
              }))
            }
            className={errors.importance ? "border-destructive" : ""}
          />
          {errors.importance && (
            <p className="text-sm text-destructive">{errors.importance}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dependencies">Dependencies (comma-separated IDs)</Label>
        <Input
          id="dependencies"
          value={formData.dependencies.join(", ")}
          onChange={(e) => handleDependenciesChange(e.target.value)}
          placeholder="e.g., task1, task2"
        />
        <p className="text-xs text-muted-foreground">
          Enter task IDs that must be completed before this task
        </p>
      </div>

      <Button type="submit" className="w-full">
        Add Task
      </Button>
    </form>
  );
}
