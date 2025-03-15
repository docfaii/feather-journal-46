import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import EntryCard from "@/components/EntryCard";
import { getFavorites } from "@/lib/journalStorage";
import { JournalEntry } from "@/lib/journalStorage";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<JournalEntry[]>([]);

  useEffect(() => {
    // Get bookmarks from storage when component mounts
    setBookmarks(getFavorites());

    // Set up an interval to refresh bookmarks periodically
    const intervalId = setInterval(() => {
      setBookmarks(getFavorites());
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen pb-24 px-4">
      <Header />
      
      <main>
        <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Bookmarks</h1>
        
        <div className="space-y-1 mb-8 animate-fade-in">
          <h2 className="text-sm text-muted-foreground font-medium">YOUR BOOKMARKS</h2>
          <div className="h-px bg-border w-full"></div>
        </div>
        
        {bookmarks.length > 0 ? (
          <div className="space-y-4">
            {bookmarks.map((entry, index) => (
              <EntryCard 
                key={entry.id} 
                entry={{
                  ...entry,
                  date: new Date(entry.date) // Convert string date to Date object
                }}
                className={`animate-scale-in transition-all delay-${index}`}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl neo-shadow p-10 text-center animate-fade-in">
            <p className="text-muted-foreground mb-4">
              You haven't bookmarked any entries yet.
            </p>
            <p className="text-sm">
              Bookmark your favorite entries for quick access.
            </p>
          </div>
        )}
      </main>
      
      <BottomBar />
    </div>
  );
};

export default Bookmarks;
