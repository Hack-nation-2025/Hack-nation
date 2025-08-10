import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CombinedTestingInterface } from "@/components/combined/CombinedTestingInterface";
import { FailureAnalysis } from "@/components/analysis/FailureAnalysis";

interface StressTestSummary {
  total_tests: number;
  successful_tests: number;
  failed_tests: number;
  failure_rate: number;
  total_duration: number;
  average_response_time: number;
  category_breakdown: Record<string, { total: number; success: number; failed: number }>;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState("testing");
  const [stressTestSummary, setStressTestSummary] = useState<StressTestSummary | null>(null);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "testing":
        return <CombinedTestingInterface onStressTestComplete={setStressTestSummary} />;
      case "analysis":
        return <FailureAnalysis stressTestSummary={stressTestSummary} />;
      default:
        return <CombinedTestingInterface onStressTestComplete={setStressTestSummary} />;
    }
  };

  return (
    <DashboardLayout 
      activeSection={activeSection} 
      onSectionChange={handleSectionChange}
      stressTestSummary={stressTestSummary}
    >
      <div className="w-full h-full">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default Index;