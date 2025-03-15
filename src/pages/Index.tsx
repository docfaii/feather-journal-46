import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import EntryCard, { EntryProps } from "@/components/EntryCard";
import EntryCardSkeleton from "@/components/EntryCardSkeleton";
import AdCard from "@/components/AdCard";
import { getAllEntries, toggleFavorite, JournalEntry } from "@/lib/journalStorage";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [entries, setEntries] = useState<EntryProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load entries from localStorage
  useEffect(() => {
    // Small delay to simulate network loading for smoother UX
    const loadEntries = setTimeout(() => {
      try {
        const storedEntries = getAllEntries();
        
        // Convert stored entries to EntryProps format
        const formattedEntries: EntryProps[] = storedEntries.map(entry => ({
          ...entry,
          date: new Date(entry.date), // Convert ISO string back to Date object
        }));
        
        setEntries(formattedEntries);
      } catch (error) {
        console.error('Error loading entries:', error);
        toast({
          title: "Error",
          description: "Failed to load journal entries",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 250);
    
    return () => clearTimeout(loadEntries);
  }, [toast]);

  // Handle toggling favorite status
  const handleFavoriteToggle = (id: string) => {
    const isFavorite = toggleFavorite(id);
    
    // Update local state to reflect the change
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === id ? { ...entry, favorite: isFavorite } : entry
      )
    );
    
    toast({
      title: isFavorite ? "Added to favorites" : "Removed from favorites",
      description: isFavorite 
        ? "Entry added to your favorites" 
        : "Entry removed from your favorites",
    });
  };

  // Render entries with ads interspersed
  const renderEntriesWithAds = () => {
    if (isLoading) {
      return (
        <>
          <EntryCardSkeleton />
          <EntryCardSkeleton />
          <EntryCardSkeleton />
        </>
      );
    }

    if (entries.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No journal entries yet. Create your first entry!</p>
        </div>
      );
    }

    // Only show ads if there are at least 3 entries
    const shouldShowAds = entries.length >= 3;
    
    return entries.reduce((acc: React.ReactNode[], entry, index) => {
      // Add the entry
      acc.push(
        <EntryCard
          key={entry.id}
          entry={entry}
          className={`animate-scale-in transition-all delay-${index}`}
          onFavoriteToggle={handleFavoriteToggle}
        />
      );
      
      // Add an ad after every 3rd entry (if we have enough entries)
      if (shouldShowAds && (index + 1) % 3 === 0 && index !== entries.length - 1) {
        acc.push(<AdCard key={`ad-${index}`} variant="medium" />);
      }
      
      return acc;
    }, []);
  };

  return (
    <div className="min-h-screen pb-24 px-4">
      <Header />
      
      <main>
        <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">My Journal</h1>
        
        <div className="space-y-1 mb-8 animate-fade-in">
          <h2 className="text-sm text-muted-foreground font-medium">RECENT ENTRIES</h2>
          <div className="h-px bg-border w-full"></div>
        </div>
        
        <div className="space-y-4">
          {renderEntriesWithAds()}
        </div>
      </main>
      
      <BottomBar />
    </div>
  );
};

export default Index;
