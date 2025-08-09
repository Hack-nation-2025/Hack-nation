import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TestGenerator } from "@/components/generator/TestGenerator";
import { StressRunner } from "@/components/runner/StressRunner";
import { FailureAnalysis } from "@/components/analysis/FailureAnalysis";

const Index = () => {
  const [activeSection, setActiveSection] = useState("generator");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "generator":
        return <TestGenerator />;
      case "runner":
        return <StressRunner />;
      case "analysis":
        return <FailureAnalysis />;
      default:
        return <TestGenerator />;
    }
  };

  return (
    <DashboardLayout 
      activeSection={activeSection} 
      onSectionChange={handleSectionChange}
    >
      <div className="w-full h-full">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default Index;