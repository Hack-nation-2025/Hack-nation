import { useState } from "react";
import { TestGenerator } from "@/components/generator/TestGenerator";
import { StressRunner } from "@/components/runner/StressRunner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  Zap,
  Play,
  Pause
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestResult {
  id: string;
  input: string;
  output: string;
  status: "success" | "failure" | "timeout";
  responseTime: number;
  errorType?: string;
}

interface StressTestSummary {
  total_tests: number;
  successful_tests: number;
  failed_tests: number;
  failure_rate: number;
  total_duration: number;
  average_response_time: number;
  category_breakdown: Record<string, { total: number; success: number; failed: number }>;
}

interface CombinedTestingInterfaceProps {
  onStressTestComplete: (summary: StressTestSummary) => void;
}

export function CombinedTestingInterface({ onStressTestComplete }: CombinedTestingInterfaceProps) {
    const { toast } = useToast();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [modelUrl, setModelUrl] = useState("https://api.openai.com/v1/chat/completions");
  const [apiKey, setApiKey] = useState("");
  const [totalTests, setTotalTests] = useState(250)

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [stressTestSummary, setStressTestSummary] = useState<StressTestSummary | null>(null);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const handleStartStop = async () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }

    if (selectedCategories.length === 0) {
      toast({
        title: "No Categories Selected",
        description: "Please select at least one test category to run.",
        variant: "destructive",
      });
      return; // Stop the function from proceeding
    }

    toast({
        title: "Starting stress tests...",
        description: "Running tests against the target LLM.",
    });

    try {
      setIsRunning(true);
      
      const response = await fetch('http://127.0.0.1:5001/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_url: modelUrl,
          api_key: apiKey,
          categories: selectedCategories,
          totalTests: totalTests,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "An unknown backend error occurred.");
      }

      console.log("Backend Response:", responseData);
      
      // Extract the stress test summary
      if (responseData.summary) {
        setStressTestSummary(responseData.summary);
        
        // Call the callback to pass data to parent component
        onStressTestComplete(responseData.summary);
        
        toast({
          title: "Tests Completed!",
          description: `Failure rate: ${responseData.summary.failure_rate}%`,
          variant: "default",
        });
      }
      
      setIsRunning(false);

    } catch (error) {
      console.error("Failed to connect to backend:", error);
      toast({
        title: "Connection Failed",
        description: `Could not connect to the backend. Is it running on port 5001?`,
        variant: "destructive",
      });
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "failure":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "timeout":
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-success text-success-foreground">Success</Badge>;
      case "failure":
        return <Badge variant="destructive">Failure</Badge>;
      case "timeout":
        return <Badge className="bg-warning text-warning-foreground">Timeout</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section: Test Generator and Stress Runner */}
      <div className="w-full grid grid-cols-2 gap-8">
        <div>
          <TestGenerator 
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
          />
        </div>
        <div>
          <StressRunner 
            isRunning={isRunning}
            onStartStop={handleStartStop}
            modelUrl={modelUrl}
            setModelUrl={setModelUrl}
            apiKey={apiKey}
            setApiKey={setApiKey}
            totalTests={totalTests}
            setTotalTests={setTotalTests}
            stressTestSummary={stressTestSummary}
          />
        </div>
      </div>

      <div className="w-full flex justify-center">
        <Button
          onClick={handleStartStop}
          size="lg"
          className="w-full max-w-4xl"
          disabled={isRunning} // Disable the button while tests are running
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Stress Tests
            </>
          )}
        </Button>
      </div>

      {/* Bottom Section: Execution Status and Live Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Execution Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{currentTest}/{totalTests}</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-success">{results.filter(r => r.status === "success").length}</div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-destructive">{results.filter(r => r.status === "failure").length}</div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>

            {isRunning && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 animate-pulse-glow text-primary" />
                <span>Running test #{currentTest + 1}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Results */}
        <Card>
          <CardHeader>
            <CardTitle>Live Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No results yet</p>
                  <p className="text-xs">Start tests to see live results</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {results.map((result) => (
                    <div key={result.id} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.status)}
                          <span className="text-sm font-medium">Test #{result.id}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(result.status)}
                          <span className="text-xs text-muted-foreground">{result.responseTime}ms</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {result.input.substring(0, 60)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}