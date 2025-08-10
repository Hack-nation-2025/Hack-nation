import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Zap, AlertTriangle, Settings, Play, Pause, RotateCcw, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}
export function DashboardLayout({
  children,
  activeSection,
  onSectionChange
}: DashboardLayoutProps) {
  const sections = [{
    id: "testing",
    label: "Testing Suite",
    icon: Zap
  }, {
    id: "analysis",
    label: "Analysis",
    icon: AlertTriangle
  }];
  const currentIndex = sections.findIndex(s => s.id === activeSection);
  const nextSection = sections[currentIndex + 1];
  const handleNext = () => {
    if (nextSection) {
      onSectionChange(nextSection.id);
    }
  };
  return <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
        backgroundImage: `
            linear-gradient(rgba(330, 100%, 70%, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(330, 100%, 70%, 0.1) 1px, transparent 1px)
          `,
        backgroundSize: '40px 40px'
      }} />
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/95">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-primary animate-neon-pulse">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-cyber bg-clip-text text-transparent animate-cyber-flicker">
                FailProof LLM
              </h1>
            </div>
            
            {/* Navigation in Header */}
            <div className="flex items-center space-x-2">
              {sections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return <button key={section.id} onClick={() => onSectionChange(section.id)} className={cn("flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300", isActive ? "bg-gradient-primary text-primary-foreground shadow-primary border border-primary/50" : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-accent/30")}>
                    <Icon className={cn("h-4 w-4", isActive && "animate-pulse-glow")} />
                    <span>{section.label}</span>
                    {isActive && <div className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />}
                  </button>;
            })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative px-8 py-8">
        {children}
        
        {/* Next Button */}
        {nextSection && <div className="fixed bottom-8 right-8 z-20">
            <Button onClick={handleNext} size="lg" className="bg-gradient-secondary shadow-secondary border border-secondary/50 hover:shadow-accent gap-3 px-6 py-3">
              <span className="font-medium">Next: {nextSection.label}</span>
              <ChevronRight className="h-5 w-5 animate-pulse-glow" />
            </Button>
          </div>}
      </main>
    </div>;
}