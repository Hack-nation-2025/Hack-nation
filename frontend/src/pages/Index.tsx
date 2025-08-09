import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TestGenerator } from "@/components/generator/TestGenerator";
import { StressRunner } from "@/components/runner/StressRunner";
import { FailureAnalysis } from "@/components/analysis/FailureAnalysis";

const Index = () => {
  const [activeSection, setActiveSection] = useState("generator");
  
  // State for categories, selected by the Generator, used by the Runner
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // NEW: State for the results, set by the Runner, used by the Analysis
  const [testResults, setTestResults] = useState<any>(null);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "generator":
        return <TestGenerator 
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />;
      case "runner":
        return <StressRunner 
                  selectedCategories={selectedCategories} 
                  setTestResults={setTestResults} 
                />;
      case "analysis":
        // Pass the results data down to the analysis component
        return <FailureAnalysis testResults={testResults} />;
      default:
        return <TestGenerator 
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />;
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