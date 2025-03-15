import React from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import AdCard from "@/components/AdCard";
import { featureFlags } from "@/config/features";

const Insights = () => {
  if (featureFlags.insightsEnabled) {
    // Render actual Insights component here
    return (
      <div className="min-h-screen pb-24 px-4">
        <Header />
        <main>
          <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Insights</h1>
          <div>{/* Actual Insights Content */}</div>
          <div className="mt-8">
            <AdCard variant="medium" />
          </div>
        </main>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4">
      <Header />
      
      <main>
        <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Insights</h1>
        
        <div className="space-y-1 mb-8 animate-fade-in">
          <h2 className="text-sm text-muted-foreground font-medium">COMING SOON</h2>
          <div className="h-px bg-border w-full"></div>
        </div>
        
        <div className="rounded-xl neo-shadow p-8 text-center animate-fade-in">
          <h3 className="text-xl font-medium mb-4">Personalized Insights</h3>
          <p className="text-muted-foreground mb-6">
            This feature is coming soon! You'll be able to unlock personalized insights based on your journal entries:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-lg glass-morphism">
              <h4 className="font-medium mb-2">Highlights Tab</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Revisits section with stories like display of compiled entries from each month based on favorited/bookmarked entries from each week</li>
                <li>• Time Travel section with an AI generated emotional quote based on a random entry with a refresh icon. The click on the quote container opens that journal entry</li>
                <li>• Mood Analysis
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>• Track your mood trends</li>
                    <li>• Identify triggers</li>
                    <li>• Get personalized tips</li>
                  </ul>
                </li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg glass-morphism">
              <h4 className="font-medium mb-2">Stats Tab</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Stats buttons like - Total words written, Longest Streak, Total Baby Kicks etc</li>
                <li>• A list of badges like - WordSmith, Kick Champion etc</li>
                <li>• A Chart of Entry Activity across the pregnancy Period</li>
                <li>• Month Streak - A current month calender widget with white dots and black dots denoting the entries on each day of the month</li>
                <li>• Week Streak - A week display widget with entries marked</li>
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

export default Insights;
