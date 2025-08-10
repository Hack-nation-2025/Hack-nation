import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  Pause, 
  Square, 
  Settings,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  Zap
} from "lucide-react";

interface StressRunnerProps {
  isRunning: boolean;
  onStartStop: () => void;
  totalTests: number;
  setTotalTests: (count: number) => void;
}

interface TestResult {
  id: string;
  input: string;
  output: string;
  status: "success" | "failure" | "timeout";
  responseTime: number;
  errorType?: string;
}

export function StressRunner({ isRunning, onStartStop, totalTests, setTotalTests }: StressRunnerProps) {
  const [modelUrl, setModelUrl] = useState("");
  const [apiKey, setApiKey] = useState("");


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stress Test Runner</h2>
          <p className="text-muted-foreground">Execute test suites against your target LLM</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model-url">Model URL</Label>
            <Input 
              id="model-url" 
              placeholder="https://api.openai.com/v1/chat/completions"
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key (Optional)</Label>
            <Input 
              id="api-key" 
              type="password"
              placeholder="Enter your API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-count">Test Count</Label>
            <Input 
              id="test-count" 
              type="number" 
              value={totalTests}
              onChange={(e) => setTotalTests(Number(e.target.value))}
              min="1"
              max="1000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Run Tests Button */}
      <div className="w-full flex justify-center">
        <Button 
          onClick={onStartStop}
          variant={isRunning ? "destructive" : "secondary"}
          size="lg"
          className="w-full max-w-4xl gap-2 shadow-primary hover:shadow-primary"
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" />
              Stop Tests
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Stress Tests
            </>
          )}
        </Button>
      </div>
    </div>
  );
}