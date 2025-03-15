import React from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import AdCard from "@/components/AdCard";
import { featureFlags } from "@/config/features";
import { cn } from "@/lib/utils";

const BabyHealth = () => {
  if (featureFlags.babyHealthEnabled) {
    // Render actual BabyHealth component here
    return (
      <div className="min-h-screen pb-24 px-4 bg-red-100"> {/* Apply red-pink hue */}
        <Header />
        <main>
          <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Baby Health</h1>
          <div>{/* Actual Baby Health Content */}</div>
          <div className="mt-8">
            <AdCard variant="medium" />
          </div>
        </main>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 bg-red-100"> {/* Apply red-pink hue */}
      <Header />
      
      <main>
        <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Baby Health</h1>
        
        <div className="space-y-1 mb-8 animate-fade-in">
          <h2 className="text-sm text-muted-foreground font-medium">COMING SOON</h2>
          <div className="h-px bg-border w-full"></div>
        </div>
        
        <div className="rounded-xl neo-shadow p-8 text-center animate-fade-in">
          <h3 className="text-xl font-medium mb-4">Pregnancy Tracking & Baby Health</h3>
          <p className="text-muted-foreground mb-6">
            This feature is coming soon! You'll be able to track your pregnancy journey, including:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-lg glass-morphism">
              <h4 className="font-medium mb-2">Baby Development</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Week-by-week size visualization</li>
                <li>• Development milestones</li>
                <li>• Fetal health articles</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg glass-morphism">
              <h4 className="font-medium mb-2">Mother's Health</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Symptom tracking</li>
                <li>• Weight monitoring</li>
                <li>• Appointment reminders</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <AdCard variant="medium" />
        </div>
      </main>
      
      <BottomBar />
    </div>
  );
};

export default BabyHealth;
