import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";


interface TestGeneratorProps {
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
}

export function TestGenerator({ selectedCategories, onCategoryToggle }: TestGeneratorProps) {
  
  const testCategories = [{
    id: "prompt-injection",
    label: "Prompt Injection",
    description: "Attempts to override system instructions"
  }, {
    id: "malformed-json",
    label: "Malformed JSON",
    description: "Invalid JSON structures and syntax errors"
  }, {
    id: "sentence-relationship",
    label: "Sentence Relationship",
    description: "Two sentences where LLM determines if second relates to first"
  }, {
    id: "mixed-languages",
    label: "Mixed Languages",
    description: "Multiple languages in single input"
  }, {
    id: "contradictory",
    label: "Contradictory Instructions",
    description: "Conflicting commands and requests"
  }];
 
  return (
    <div className="space-y-6">
      {/* This is the header you wanted to keep */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Test Case Generator</h2>
        <p className="text-muted-foreground">Create adversarial inputs and edge cases to stress-test your LLM</p>
      </div>

      {/* This is the configuration card */}
      <Card>
        <CardHeader>
            <CardTitle>Test Categories</CardTitle>
            <p className="text-sm text-muted-foreground pt-1">Select the types of attacks to run.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {testCategories.map(category => (
            <div key={category.id} className="flex items-start space-x-3">
              <Switch
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onCategoryToggle(category.id)}
              />
              <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={category.id} className="font-medium">
                      {category.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                      {category.description}
                  </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}