import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// ... other imports remain the same
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// This function processes the raw JSON report into a format our charts can use
const processTestResults = (testResults: any) => {
  if (!testResults || !testResults.tests) {
    return {
      summary: { total: 0, passed: 0, failed: 0 },
      failureData: [],
      criticalFailures: [],
    };
  }

  const failuresByCategory: { [key: string]: number } = {};
  const criticalFailures: any[] = [];
  
  testResults.tests.forEach((test: any) => {
    if (test.outcome === 'failed') {
      // NOTE: The pytest report doesn't include the category. 
      // This is a simplification for the hackathon. We'll categorize based on keywords in the test name.
      const nodeId = test.nodeid;
      let category = "Unknown";
      if (nodeId.includes('malformed')) category = 'Malformed Input';
      if (nodeId.includes('safety')) category = 'Safety/Policy';
      if (nodeId.includes('contradictory')) category = 'Contradictory';

      failuresByCategory[category] = (failuresByCategory[category] || 0) + 1;

      // Simple logic to identify a "critical" failure for display
      if (criticalFailures.length < 3) {
        criticalFailures.push({
          id: nodeId.split('[')[1].replace(']',''),
          type: category,
          severity: "High",
          input: "Input data not available in this report.",
          output: test.call.longrepr,
          recommendation: "Review assertion logic in test harness."
        });
      }
    }
  });

  const colors = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))"];
  const failureData = Object.entries(failuresByCategory).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length],
  }));
  
  return { summary: testResults.summary, failureData, criticalFailures };
};

export function FailureAnalysis({ testResults }: { testResults: any }) {
  // useMemo will re-calculate the data only when testResults changes
  const { summary, failureData, criticalFailures } = useMemo(() => processTestResults(testResults), [testResults]);
  
  if (!testResults) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No test results available.</p>
        <p className="text-xs">Go to the 'Stress Runner' tab and run a test suite.</p>
      </div>
    );
  }

  // The rest of your JSX can now use the processed `summary`, `failureData`, and `criticalFailures`
  // instead of the hardcoded mock data.
  
  return (
    <div className="space-y-6">
      {/* ... header ... */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Summary Cards */}
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{summary.failed || 0}</div>
            <div className="text-xs text-muted-foreground">Total Failures</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {summary.total > 0 ? ((summary.failed / summary.total) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">Failure Rate</div>
          </CardContent>
        </Card>
         {/* ... other summary cards ... */}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList> {/* ... */}</TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>Failure Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie data={failureData} dataKey="value" nameKey="name" innerRadius={80} outerRadius={140}>
                    {failureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* ... legend ... */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="critical">
            {/* Map over the `criticalFailures` array here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}