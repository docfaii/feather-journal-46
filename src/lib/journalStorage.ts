import { v4 as uuidv4 } from 'uuid';
import { AttachmentType } from "@/components/AttachmentHandler";
import { MoodType } from "@/components/MoodSelector";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string for localStorage compatibility
  favorite: boolean;
  media: {
    type: AttachmentType;
    url: string;
  }[];
  mood?: MoodType;
  kickCount?: number;
  isShared?: boolean;
  sharedWithGroups?: string[]; // Array of group IDs
}

// Key for localStorage
const JOURNAL_ENTRIES_KEY = 'pregnancyJournal_entries';
const INNER_CIRCLE_GROUPS_KEY = 'innerCircleGroups';
const INNER_CIRCLE_COMMENTS_KEY = 'innerCircleComments';
const INNER_CIRCLE_LIKES_KEY = 'innerCircleLikes';

// Get all entries
export const getAllEntries = (): JournalEntry[] => {
  const entriesJson = localStorage.getItem(JOURNAL_ENTRIES_KEY);
  if (!entriesJson) return [];
  
  try {
    const entries = JSON.parse(entriesJson);
    // Sort by date, newest first
    return entries.sort((a: JournalEntry, b: JournalEntry) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error parsing journal entries:', error);
    return [];
  }
};

// Get a single entry by ID
export const getEntry = (id: string): JournalEntry | undefined => {
  const entries = getAllEntries();
  return entries.find(entry => entry.id === id);
};

// Save a new entry
export const saveEntry = (entry: Omit<JournalEntry, 'id'>): JournalEntry => {
  const entries = getAllEntries();
  const newEntry: JournalEntry = {
    ...entry,
    id: uuidv4(),
    date: new Date().toISOString(), // Ensure date is stored as string
  };
  
  // Make sure we have default values for optional fields
  if (newEntry.mood === undefined) newEntry.mood = null;
  if (newEntry.kickCount === undefined) newEntry.kickCount = 0;
  if (newEntry.isShared === undefined) newEntry.isShared = false;
  if (newEntry.sharedWithGroups === undefined) newEntry.sharedWithGroups = [];
  
  localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify([newEntry, ...entries]));
  return newEntry;
};

// Update an existing entry
export const updateEntry = (updatedEntry: JournalEntry): JournalEntry => {
  const entries = getAllEntries();
  const updatedEntries = entries.map(entry => 
    entry.id === updatedEntry.id ? { ...updatedEntry } : entry
  );
  
  localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(updatedEntries));
  return updatedEntry;
};

// Delete an entry
export const deleteEntry = (id: string): boolean => {
  const entries = getAllEntries();
  const filteredEntries = entries.filter(entry => entry.id !== id);
  
  localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(filteredEntries));
  return true;
};

// Toggle favorite status
export const toggleFavorite = (id: string): boolean => {
  const entry = getEntry(id);
  if (!entry) return false;
  
  const updatedEntry = { 
    ...entry, 
    favorite: !entry.favorite 
  };
  
  updateEntry(updatedEntry);
  return updatedEntry.favorite;
};

// Get favorite entries
export const getFavorites = (): JournalEntry[] => {
  const entries = getAllEntries();
  return entries.filter(entry => entry.favorite);
};

// Update mood
export const updateMood = (id: string, mood: MoodType): boolean => {
  const entry = getEntry(id);
  if (!entry) return false;
  
  const updatedEntry = { 
    ...entry, 
    mood 
  };
  
  updateEntry(updatedEntry);
  return true;
};

// Update sharing status
export const updateSharing = (id: string, isShared: boolean, groupIds?: string[]): boolean => {
  const entry = getEntry(id);
  if (!entry) return false;
  
  const updatedEntry = { 
    ...entry, 
    isShared,
    sharedWithGroups: groupIds || []
  };
  
  updateEntry(updatedEntry);
  return true;
};

// Get entries shared with a specific group
export const getEntriesSharedWithGroup = (groupId: string): JournalEntry[] => {
  const entries = getAllEntries();
  return entries.filter(entry => 
    entry.isShared && 
    entry.sharedWithGroups && 
    entry.sharedWithGroups.includes(groupId)
  );
};

// Update kick count
export const updateKickCount = (id: string, kickCount: number): boolean => {
  const entry = getEntry(id);
  if (!entry) return false;
  
  const updatedEntry = { 
    ...entry, 
    kickCount 
  };
  
  updateEntry(updatedEntry);
  return true;
};

// Inner Circle Group Management
export interface InnerCircleGroup {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
  members?: {
    id: string;
    email?: string;
    name?: string;
  }[];
}

// Get all inner circle groups
export const getAllGroups = (): InnerCircleGroup[] => {
  const groupsJson = localStorage.getItem(INNER_CIRCLE_GROUPS_KEY);
  if (!groupsJson) {
    // Default groups if none exist
    const defaultGroups: InnerCircleGroup[] = [
      { id: "1", name: "Family", memberCount: 0, createdAt: new Date().toISOString() },
      { id: "2", name: "Friends", memberCount: 0, createdAt: new Date().toISOString() },
      { id: "3", name: "Partner", memberCount: 0, createdAt: new Date().toISOString() },
    ];
    localStorage.setItem(INNER_CIRCLE_GROUPS_KEY, JSON.stringify(defaultGroups));
    return defaultGroups;
  }
  
  try {
    return JSON.parse(groupsJson);
  } catch (error) {
    console.error('Error parsing inner circle groups:', error);
    return [];
  }
};

// Get a single group by ID
export const getGroup = (id: string): InnerCircleGroup | undefined => {
  const groups = getAllGroups();
  return groups.find(group => group.id === id);
};

// Create a new group
export const createGroup = (name: string): InnerCircleGroup => {
  const groups = getAllGroups();
  const newGroup: InnerCircleGroup = {
    id: uuidv4(),
    name,
    memberCount: 0,
    createdAt: new Date().toISOString(),
    members: []
  };
  
  localStorage.setItem(INNER_CIRCLE_GROUPS_KEY, JSON.stringify([...groups, newGroup]));
  return newGroup;
};

// Delete a group
export const deleteGroup = (id: string): boolean => {
  const groups = getAllGroups();
  const filteredGroups = groups.filter(group => group.id !== id);
  
  localStorage.setItem(INNER_CIRCLE_GROUPS_KEY, JSON.stringify(filteredGroups));
  
  // Also unshare any entries shared with this group
  const entries = getAllEntries();
  const updatedEntries = entries.map(entry => {
    if (entry.sharedWithGroups && entry.sharedWithGroups.includes(id)) {
      const updatedGroups = entry.sharedWithGroups.filter(groupId => groupId !== id);
      return {
        ...entry,
        sharedWithGroups: updatedGroups,
        isShared: updatedGroups.length > 0
      };
    }
    return entry;
  });
  
  localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(updatedEntries));
  
  return true;
};

// Add member to group
export const addMemberToGroup = (groupId: string, memberEmail: string): boolean => {
  const groups = getAllGroups();
  const groupIndex = groups.findIndex(group => group.id === groupId);
  
  if (groupIndex === -1) return false;
  
  const group = groups[groupIndex];
  const members = group.members || [];
  
  // Check if member already exists
  if (members.some(member => member.email === memberEmail)) {
    return false;
  }
  
  // Add new member
  const updatedGroup = {
    ...group,
    members: [
      ...members,
      { id: uuidv4(), email: memberEmail }
    ],
    memberCount: (group.memberCount || 0) + 1
  };
  
  groups[groupIndex] = updatedGroup;
  localStorage.setItem(INNER_CIRCLE_GROUPS_KEY, JSON.stringify(groups));
  
  return true;
};

// Remove member from group
export const removeMemberFromGroup = (groupId: string, memberId: string): boolean => {
  const groups = getAllGroups();
  const groupIndex = groups.findIndex(group => group.id === groupId);
  
  if (groupIndex === -1) return false;
  
  const group = groups[groupIndex];
  const members = group.members || [];
  
  // Check if member exists
  if (!members.some(member => member.id === memberId)) {
    return false;
  }
  
  // Remove member
  const updatedGroup = {
    ...group,
    members: members.filter(member => member.id !== memberId),
    memberCount: Math.max(0, (group.memberCount || 0) - 1)
  };
  
  groups[groupIndex] = updatedGroup;
  localStorage.setItem(INNER_CIRCLE_GROUPS_KEY, JSON.stringify(groups));
  
  return true;
};

// Inner Circle Comments
export interface Comment {
  id: string;
  entryId: string;
  author: string;
  content: string;
  date: string;
}

// Get comments for an entry
export const getCommentsForEntry = (entryId: string): Comment[] => {
  const commentsJson = localStorage.getItem(INNER_CIRCLE_COMMENTS_KEY);
  if (!commentsJson) return [];
  
  try {
    const comments: Comment[] = JSON.parse(commentsJson);
    return comments.filter(comment => comment.entryId === entryId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error parsing comments:', error);
    return [];
  }
};

// Add comment to an entry
export const addComment = (entryId: string, author: string, content: string): Comment => {
  const commentsJson = localStorage.getItem(INNER_CIRCLE_COMMENTS_KEY);
  let comments: Comment[] = [];
  
  if (commentsJson) {
    try {
      comments = JSON.parse(commentsJson);
    } catch (error) {
      console.error('Error parsing comments:', error);
    }
  }
  
  const newComment: Comment = {
    id: uuidv4(),
    entryId,
    author,
    content,
    date: new Date().toISOString()
  };
  
  localStorage.setItem(INNER_CIRCLE_COMMENTS_KEY, JSON.stringify([...comments, newComment]));
  return newComment;
};

// Delete comment
export const deleteComment = (commentId: string): boolean => {
  const commentsJson = localStorage.getItem(INNER_CIRCLE_COMMENTS_KEY);
  if (!commentsJson) return false;
  
  try {
    const comments: Comment[] = JSON.parse(commentsJson);
    const filteredComments = comments.filter(comment => comment.id !== commentId);
    localStorage.setItem(INNER_CIRCLE_COMMENTS_KEY, JSON.stringify(filteredComments));
    return true;
  } catch (error) {
    console.error('Error parsing comments:', error);
    return false;
  }
};

// Inner Circle Likes
export interface Like {
  entryId: string;
  userId: string;
  date: string;
}

// Get likes for an entry
export const getLikesForEntry = (entryId: string): Like[] => {
  const likesJson = localStorage.getItem(INNER_CIRCLE_LIKES_KEY);
  if (!likesJson) return [];
  
  try {
    const likes: Like[] = JSON.parse(likesJson);
    return likes.filter(like => like.entryId === entryId);
  } catch (error) {
    console.error('Error parsing likes:', error);
    return [];
  }
};

// Toggle like on an entry
export const toggleLike = (entryId: string, userId: string): boolean => {
  const likesJson = localStorage.getItem(INNER_CIRCLE_LIKES_KEY);
  let likes: Like[] = [];
  
  if (likesJson) {
    try {
      likes = JSON.parse(likesJson);
    } catch (error) {
      console.error('Error parsing likes:', error);
    }
  }
  
  const existingLikeIndex = likes.findIndex(
    like => like.entryId === entryId && like.userId === userId
  );
  
  if (existingLikeIndex !== -1) {
    // Unlike
    likes.splice(existingLikeIndex, 1);
    localStorage.setItem(INNER_CIRCLE_LIKES_KEY, JSON.stringify(likes));
    return false; // Return false to indicate the entry is now unliked
  } else {
    // Like
    const newLike: Like = {
      entryId,
      userId,
      date: new Date().toISOString()
    };
    
    localStorage.setItem(INNER_CIRCLE_LIKES_KEY, JSON.stringify([...likes, newLike]));
    return true; // Return true to indicate the entry is now liked
  }
};
