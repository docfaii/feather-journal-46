import { EntryProps } from "@/components/EntryCard";
import { MoodType } from "@/components/MoodSelector";

export const mockEntries: EntryProps[] = [
  {
    id: "1",
    title: "Morning Reflections",
    content: "Today I woke up feeling refreshed and motivated. The sun was shining through my window, and I felt a sense of purpose. I made a mental list of the things I wanted to accomplish, and I'm excited to get started.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    favorite: true,
    media: [{ type: "photo", url: "/placeholder.svg" }],
    mood: "happy",
    kickCount: 0,
    isShared: false
  },
  {
    id: "2",
    title: "Creative Breakthrough",
    content: "I finally solved the design problem I've been working on for weeks. Sometimes stepping away from a project is exactly what you need to gain clarity. I'm going to implement these ideas tomorrow and see where they lead.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    favorite: false,
    media: [{ type: "audio", url: "/audio-sample.mp3" }],
    mood: "content",
    kickCount: 3,
    isShared: true
  },
  {
    id: "3",
    title: "Lunch with Sam",
    content: "Had lunch with Sam today at that new café downtown. We talked about our future plans and shared some good laughs. It's always rejuvenating to connect with old friends who understand your journey.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    favorite: true,
    media: [
      { type: "gallery", url: "/placeholder.svg" },
      { type: "gallery", url: "/placeholder.svg" },
      { type: "gallery", url: "/placeholder.svg" }
    ],
    mood: "happy",
    kickCount: 5,
    isShared: true
  },
  {
    id: "4",
    title: "Book Thoughts: Atomic Habits",
    content: "Finished reading 'Atomic Habits' by James Clear. The concept of 1% improvements really resonates with me. I'm going to start implementing some of these small habits in my daily routine and see how they compound over time.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    favorite: false,
    media: [{ type: "video", url: "/video-sample.mp4" }],
    mood: "neutral",
    kickCount: 0,
    isShared: false
  },
  {
    id: "5",
    title: "Weekend Plans",
    content: "Planning a quiet weekend of reading and hiking. Sometimes you need to disconnect to reconnect with yourself. Looking forward to some solitude and reflection in nature.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    favorite: false,
    media: [],
    mood: "content",
    kickCount: 0,
    isShared: false
  },
];

export const getFavorites = () => {
  return mockEntries.filter(entry => entry.favorite);
};

export const getEntry = (id: string) => {
  return mockEntries.find(entry => entry.id === id);
};
