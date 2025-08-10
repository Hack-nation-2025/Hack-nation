import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dispatch, SetStateAction } from "react";
import { 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

interface StressTestSummary {
  total_tests: number;
  successful_tests: number;
  failed_tests: number;
  failure_rate: number;
  total_duration: number;
  average_response_time: number;
  category_breakdown: Record<string, { total: number; success: number; failed: number }>;
}

interface StressRunnerProps {
  isRunning: boolean;
  onStartStop: () => void;

  modelUrl: string;
  setModelUrl: Dispatch<SetStateAction<string>>;
  apiKey: string;
  setApiKey: Dispatch<SetStateAction<string>>;
  totalTests: number;
  setTotalTests: Dispatch<SetStateAction<number>>;
  stressTestSummary: StressTestSummary | null;
}

export function StressRunner({
  modelUrl,
  setModelUrl,
  apiKey,
  setApiKey,
  totalTests,
  setTotalTests,
  stressTestSummary,
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

      {/* Test Results Summary */}
      {stressTestSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Test Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stressTestSummary.total_tests}</div>
                <div className="text-xs text-muted-foreground">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{stressTestSummary.successful_tests}</div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{stressTestSummary.failed_tests}</div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{stressTestSummary.failure_rate}%</div>
                <div className="text-xs text-muted-foreground">Failure Rate</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold">{stressTestSummary.total_duration}s</div>
                <div className="text-xs text-muted-foreground">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{stressTestSummary.average_response_time}ms</div>
                <div className="text-xs text-muted-foreground">Avg Response</div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Category Breakdown:</div>
              <div className="space-y-1">
                {Object.entries(stressTestSummary.category_breakdown).map(([category, stats]) => (
                  <div key={category} className="flex items-center justify-between text-xs">
                    <span className="capitalize">{category.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {stats.success}/{stats.total}
                      </Badge>
                      <span className="text-muted-foreground">
                        {stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}