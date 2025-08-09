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

export function MetricsOverview() {
  const metrics = [
    {
      title: "Total Tests Run",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Zap,
      color: "primary"
    },
    {
      title: "Failure Rate",
      value: "23.4%",
      change: "-5.2%",
      trend: "down",
      icon: AlertTriangle,
      color: "destructive"
    },
    {
      title: "Success Rate",
      value: "76.6%",
      change: "+5.2%",
      trend: "up",
      icon: CheckCircle,
      color: "success"
    },
    {
      title: "Avg Response Time",
      value: "234ms",
      change: "+8ms",
      trend: "up",
      icon: Clock,
      color: "warning"
    }
  ];

  const recentFailures = [
    { type: "Prompt Injection", severity: "High", count: 45 },
    { type: "Malformed JSON", severity: "Medium", count: 32 },
    { type: "Unicode Attack", severity: "High", count: 28 },
    { type: "Long Input", severity: "Low", count: 19 }
  ];

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
            <span>Current Test Suite Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Adversarial Input Tests</span>
              <span className="font-medium">342/500</span>
            </div>
            <Progress value={68} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Edge Case Validation</span>
              <span className="font-medium">89/150</span>
            </div>
            <Progress value={59} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Malformed Data Tests</span>
              <span className="font-medium">156/200</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>
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