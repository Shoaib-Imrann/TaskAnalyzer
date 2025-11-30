"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TaskFormData {
  title: string;
  due_date: string;
  estimated_hours: number;
  importance: number | "";
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

    if (
      formData.importance === "" ||
      formData.importance < 1 ||
      formData.importance > 10
    ) {
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
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-col md:flex-row gap-2 md:items-end">
        <div className="flex-1 md:w-64">
          <Label htmlFor="title" className="text-sm text-gray-400">
            Title
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Task title"
            className={`placeholder:text-gray-300 ${errors.title ? "border-red-500" : ""}`}
          />
        </div>
        <div className="flex-1 md:flex-none">
          <Label htmlFor="due_date" className="text-sm text-gray-400">
            Due Date
          </Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, due_date: e.target.value }))
            }
            className={`placeholder:text-gray-300 ${errors.due_date ? "border-red-500" : ""}`}
          />
        </div>
        <div className="flex-1 md:w-20">
          <Label htmlFor="estimated_hours" className="text-sm text-gray-400">
            Hours
          </Label>
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
            className={`placeholder:text-gray-300 ${errors.estimated_hours ? "border-red-500" : ""}`}
          />
        </div>
        <div className="flex-1 md:w-20">
          <Label htmlFor="importance" className="text-sm text-gray-400">
            Priority
          </Label>
          <Input
            id="importance"
            type="number"
            min="1"
            max="10"
            value={formData.importance}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                importance:
                  e.target.value === "" ? "" : parseInt(e.target.value, 10),
              }))
            }
            className={`placeholder:text-gray-300 ${errors.importance ? "border-red-500" : ""}`}
          />
        </div>
        <div className="flex-1 md:w-40">
          <Label htmlFor="dependencies" className="text-sm text-gray-400">
            Dependencies
          </Label>
          <Input
            id="dependencies"
            value={formData.dependencies.join(", ")}
            onChange={(e) => handleDependenciesChange(e.target.value)}
            placeholder="task1, task2"
            className="placeholder:text-gray-300"
          />
        </div>
        <Button type="submit" className="w-full md:w-auto">
          Add
        </Button>
      </div>
      {(errors.title ||
        errors.due_date ||
        errors.estimated_hours ||
        errors.importance) && (
        <div className="text-sm text-red-600">
          {Object.values(errors).join(", ")}
        </div>
      )}
    </form>
  );
}
