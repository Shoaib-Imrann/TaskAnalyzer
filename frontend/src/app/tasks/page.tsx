"use client";

import { useState } from "react";
import { BulkImport } from "@/components/tasks/BulkImport";
import { ModeSelector } from "@/components/tasks/ModeSelector";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";

import axiosInstance from "@/config/axios";

export interface Task {
  id: string;
  title: string;
  due_date: string;
  estimated_hours: number;
  importance: number;
  dependencies: string[];
  score?: number;
  explanation?: string;
}

export type AnalysisMode =
  | "Fastest Wins"
  | "High Impact"
  | "Deadline Driven"
  | "Smart Balance";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mode, setMode] = useState<AnalysisMode>("Smart Balance");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedTaskIds, setSuggestedTaskIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addTask = (taskData: {
    title: string;
    due_date: string;
    estimated_hours: number;
    importance: number | "";
    dependencies: string[];
  }) => {
    const newTask: Task = {
      ...taskData,
      importance:
        typeof taskData.importance === "number" ? taskData.importance : 5,
      id: Date.now().toString(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const loadTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const analyzeTasks = async () => {
    if (tasks.length === 0) {
      setError("Please add some tasks before analyzing");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const modeMap = {
        "Fastest Wins": "fastest_wins",
        "High Impact": "high_impact",
        "Deadline Driven": "deadline_driven",
        "Smart Balance": "smart_balance",
      };

      const response = await axiosInstance.post(
        `/api/tasks/analyze/?mode=${modeMap[mode]}`,
        tasks
      );
      setTasks(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Failed to analyze tasks"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const suggestTasks = async () => {
    setIsSuggesting(true);
    setError(null);

    try {
      const modeMap = {
        "Fastest Wins": "fastest_wins",
        "High Impact": "high_impact",
        "Deadline Driven": "deadline_driven",
        "Smart Balance": "smart_balance",
      };

      const response = await axiosInstance.get(
        `/api/tasks/suggest/?mode=${modeMap[mode]}`
      );
      const suggestions = response.data;

      // Load suggested tasks into the task list
      setTasks(suggestions);

      const taskIds = suggestions.map((task: Task) => task.id);
      setSuggestedTaskIds(taskIds);

      if (taskIds.length > 0) {
        const element = document.getElementById(`task-${taskIds[0]}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Failed to get suggestions"
      );
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Task Analyzer</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h2 className="font-semibold mb-3">Add Task</h2>
        <TaskForm onSubmit={addTask} />
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-3">Bulk Import</h2>
        <BulkImport onLoad={loadTasks} />
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-col md:flex-row md:items-end gap-2">
            <ModeSelector value={mode} onChange={setMode} />
            <Button
              onClick={analyzeTasks}
              disabled={isAnalyzing || tasks.length === 0}
              size="sm"
              className="w-full md:w-auto"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
            <Button
              variant="outline"
              onClick={suggestTasks}
              disabled={isSuggesting}
              size="sm"
              className="w-full md:w-auto"
            >
              {isSuggesting ? "Loading..." : "Suggest"}
            </Button>
          </div>
        </div>
      </div>

      <h2 className="font-semibold mb-3">Tasks ({tasks.length})</h2>
      <div>
        <TaskList
          tasks={tasks}
          onRemove={removeTask}
          suggestedTaskIds={suggestedTaskIds}
        />
      </div>
    </div>
  );
}
