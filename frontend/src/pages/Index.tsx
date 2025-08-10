import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CombinedTestingInterface } from "@/components/combined/CombinedTestingInterface";
import { FailureAnalysis } from "@/components/analysis/FailureAnalysis";

const Index = () => {
  const [activeSection, setActiveSection] = useState("testing");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "testing":
        return <CombinedTestingInterface />;
      case "analysis":
        // Pass the results data down to the analysis component
        return <FailureAnalysis testResults={testResults} />;
      default:
        return <CombinedTestingInterface />;
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