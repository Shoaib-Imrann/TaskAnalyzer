"use client";

import type { AnalysisMode } from "@/app/tasks/page";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModeSelectorProps {
  value: AnalysisMode;
  onChange: (mode: AnalysisMode) => void;
}

const modes: { value: AnalysisMode; label: string; description: string }[] = [
  {
    value: "Fastest Wins",
    label: "Fastest Wins",
    description: "Prioritize quick, easy tasks for momentum",
  },
  {
    value: "High Impact",
    label: "High Impact",
    description: "Focus on high-importance tasks first",
  },
  {
    value: "Deadline Driven",
    label: "Deadline Driven",
    description: "Prioritize by urgency and due dates",
  },
  {
    value: "Smart Balance",
    label: "Smart Balance",
    description: "Optimal balance of impact, effort, and timing",
  },
];

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="mode-select">Analysis Mode</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="mode-select">
          <SelectValue placeholder="Select analysis mode" />
        </SelectTrigger>
        <SelectContent>
          {modes.map((mode) => (
            <SelectItem key={mode.value} value={mode.value}>
              <div>
                <div className="font-medium">{mode.label}</div>
                <div className="text-xs text-muted-foreground">
                  {mode.description}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
