"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { BulkImport } from "@/components/tasks/BulkImport";
import { ModeSelector } from "@/components/tasks/ModeSelector";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
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
        "Smart Balance": "smart_balance"
      };
      
      const response = await axiosInstance.post(`/api/tasks/analyze/?mode=${modeMap[mode]}`, tasks);
      setTasks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to analyze tasks");
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
        "Smart Balance": "smart_balance"
      };
      
      const response = await axiosInstance.get(`/api/tasks/suggest/?mode=${modeMap[mode]}`);
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
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Smart Task Analyzer</h1>
        <p className="text-muted-foreground">
          Add tasks, select an analysis mode, and get intelligent prioritization
          recommendations.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm onSubmit={addTask} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Import</CardTitle>
          </CardHeader>
          <CardContent>
            <BulkImport onLoad={loadTasks} />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Analysis Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <ModeSelector value={mode} onChange={setMode} />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={analyzeTasks}
                disabled={isAnalyzing || tasks.length === 0}
                className="min-w-[120px]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Tasks"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={suggestTasks}
                disabled={isSuggesting}
                className="min-w-[120px]"
              >
                {isSuggesting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Suggest Today"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList
            tasks={tasks}
            onRemove={removeTask}
            suggestedTaskIds={suggestedTaskIds}
          />
        </CardContent>
      </Card>
    </div>
  );
}
