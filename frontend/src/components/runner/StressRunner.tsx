import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Settings, Activity, Clock, AlertCircle, CheckCircle, Zap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Define the structure of the props we expect from the parent component
interface StressRunnerProps {
  selectedCategories: string[];
  setTestResults: (results: any) => void;
}

// Define the structure of a single test result from our backend
interface TestResult {
  nodeid: string;
  outcome: "passed" | "failed";
  call: {
    longrepr: string;
    duration: number;
  };
  // We should add category to our backend response later
  category?: string; 
}

const runTestsMutationFn = async (selectedCategories: string[]) => {
  const response = await fetch("http://localhost:5001/run", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categories: selectedCategories }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.details || 'Failed to run tests');
  }
  return response.json();
};

export function StressRunner({ selectedCategories, setTestResults }: StressRunnerProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const { toast } = useToast();

  const { mutate: runTests, isPending } = useMutation({
    mutationFn: runTestsMutationFn,
    onSuccess: (data) => {
      setResults(data.tests);
      setTestResults(data); // Pass the full result object to the parent
      toast({ title: "Test run complete!", description: `${data.summary.total} tests executed.` });
    },
    onError: (error) => {
      toast({ title: "Error Running Tests!", description: error.message, variant: "destructive" });
    },
  });

  const handleStartStop = () => {
    if (selectedCategories.length === 0) {
      toast({ title: "No categories selected", description: "Go back to the generator to select categories.", variant: "destructive"});
      return;
    }
    if (!isPending) {
      setResults([]);
      setTestResults(null);
      runTests(selectedCategories);
    }
  };

  const getStatusIcon = (outcome: TestResult["outcome"]) => {
    return outcome === "passed" ? <CheckCircle className="h-4 w-4 text-success" /> : <AlertCircle className="h-4 w-4 text-destructive" />;
  };

  const getStatusBadge = (outcome: TestResult["outcome"]) => {
    return outcome === "passed" ? <Badge className="bg-success text-success-foreground">Passed</Badge> : <Badge variant="destructive">Failed</Badge>;
  };

  const passedCount = results.filter(r => r.outcome === 'passed').length;
  const failedCount = results.filter(r => r.outcome === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Configuration and other UI elements remain the same */}
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Running with {selectedCategories.length} categories selected: <span className="font-medium text-primary">{selectedCategories.join(', ')}</span>
            </p>
          </CardContent>
      </Card>

      <div className="w-full flex justify-center">
        <Button 
          onClick={handleStartStop}
          disabled={isPending}
          variant={isPending ? "destructive" : "secondary"}
          size="lg"
          className="w-full max-w-4xl gap-2"
        >
          {isPending ? (
            <><Pause className="h-4 w-4" /><span>Running Tests...</span></>
          ) : (
            <><Play className="h-4 w-4" /><span>Run Stress Tests</span></>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Execution Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={isPending ? 50 : (results.length > 0 ? 100 : 0)} className="h-3" />
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success">{passedCount}</div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">{failedCount}</div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{isPending ? "Executing tests..." : "No results yet. Click 'Run Stress Tests'."}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {results.map((result) => (
                    <div key={result.nodeid} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                          {getStatusIcon(result.outcome)}
                          <span className="text-xs font-mono text-muted-foreground truncate ml-2">{result.nodeid.split('[')[1].replace(']','')}</span>
                          {getStatusBadge(result.outcome)}
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