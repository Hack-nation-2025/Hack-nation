import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  TrendingUp,
  TrendingDown,
  Activity
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

interface MetricsOverviewProps {
  stressTestSummary: StressTestSummary;
}

export function MetricsOverview({ stressTestSummary }: MetricsOverviewProps) {
  const metrics = [
    {
      title: "Total Tests Run",
      value: stressTestSummary.total_tests.toString(),
      change: "+0%",
      trend: "up",
      icon: Zap,
      color: "primary"
    },
    {
      title: "Failure Rate",
      value: `${stressTestSummary.failed_tests} (${stressTestSummary.failure_rate}%)`,
      change: "+0%",
      trend: "down",
      icon: AlertTriangle,
      color: "destructive"
    },
    {
      title: "Success Rate",
      value: `${stressTestSummary.successful_tests} (${100 - stressTestSummary.failure_rate}%)`,
      change: "+0%",
      trend: "up",
      icon: CheckCircle,
      color: "success"
    },
    {
      title: "Avg Response Time",
      value: `${Math.round(stressTestSummary.average_response_time)}ms`,
      change: "+0ms",
      trend: "up",
      icon: Clock,
      color: "warning"
    }
  ];

  // Convert category breakdown to recent failures format
  const recentFailures = Object.entries(stressTestSummary.category_breakdown)
    .map(([category, stats]) => ({
      type: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      severity: stats.failed > 0 ? (stats.failed / stats.total > 0.5 ? "High" : "Medium") : "Low",
      count: stats.failed
    }))
    .filter(failure => failure.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === "up" && metric.color === "success" || 
                           metric.trend === "down" && metric.color === "destructive";
          
          return (
            <Card key={metric.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className={cn(
                  "h-4 w-4",
                  metric.color === "primary" && "text-primary",
                  metric.color === "destructive" && "text-destructive",
                  metric.color === "success" && "text-success",
                  metric.color === "warning" && "text-warning"
                )} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {metric.trend === "up" ? (
                    <TrendingUp className={cn(
                      "h-3 w-3",
                      isPositive ? "text-success" : "text-destructive"
                    )} />
                  ) : (
                    <TrendingDown className={cn(
                      "h-3 w-3",
                      isPositive ? "text-success" : "text-destructive"
                    )} />
                  )}
                  <span className={cn(
                    isPositive ? "text-success" : "text-destructive"
                  )}>
                    {metric.change}
                  </span>
                  <span>from last week</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Test Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Test Suite Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(stressTestSummary.category_breakdown).map(([category, stats]) => {
            const successRate = stats.total > 0 ? (stats.success / stats.total) * 100 : 0;
            const categoryName = category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{categoryName}</span>
                  <span className="font-medium">{stats.success}/{stats.total}</span>
                </div>
                <Progress value={successRate} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Failure Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span>Recent Failure Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentFailures.map((failure, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={failure.severity === "High" ? "destructive" : 
                            failure.severity === "Medium" ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {failure.severity}
                  </Badge>
                  <span className="font-medium">{failure.type}</span>
                </div>
                <span className="text-sm text-muted-foreground">{failure.count} failures</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}