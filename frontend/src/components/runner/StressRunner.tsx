import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction } from "react";
import { 
  Settings,
} from "lucide-react";

interface StressRunnerProps {
  isRunning: boolean;
  onStartStop: () => void;

  modelUrl: string;
  setModelUrl: Dispatch<SetStateAction<string>>;
  apiKey: string;
  setApiKey: Dispatch<SetStateAction<string>>;
  totalTests: number;
  setTotalTests: Dispatch<SetStateAction<number>>;
}

export function StressRunner({
  modelUrl,
  setModelUrl,
  apiKey,
  setApiKey,
  totalTests,
  setTotalTests,
}: StressRunnerProps) {


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stress Test Runner</h2>
          <p className="text-muted-foreground">Execute test suites against your target LLM</p>
        </div>
        
        <div className="flex items-center space-x-2">
          
        </div>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>LLM Configuration</span>
          </CardTitle>
           <p className="text-sm text-muted-foreground pt-1">Enter the details for your target model.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model-url">Model URL</Label>

            <Input 
              id="model-url" 
              placeholder="https://api.openai.com"
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
            <Input id="test-count" type="number" value={totalTests} onChange={e => setTotalTests(Number(e.target.value))} min="1" max="1000" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}