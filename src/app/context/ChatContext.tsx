'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: number;
}

interface ChatContextType {
  username: string;
  setUsername: (username: string) => void;
  messages: Message[];
  sendMessage: (content: string) => void;
  isConnected: boolean;
  onlineUsers: string[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Add Database type definition
interface Database {
  public: {
    Tables: {
      messages: {
        Row: Message;
        Insert: Message;
      };
    };
  };
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize database function
  const initializeDatabase = async () => {
    try {
      const { error } = await supabase.rpc('initialize_messages_table');
      if (error) {
        console.error('Error initializing database:', error);
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };

  // Setup realtime subscription
  const setupRealtime = useCallback(async (): Promise<RealtimeChannel | null> => {
    try {
      // Properly type the database query
      const { data: initialMessages, error: loadError } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true })
        .limit(100) as { data: Message[] | null; error: any };

      if (loadError) {
        console.error('Error loading messages:', loadError);
        await initializeDatabase();
        return null;
      }

      if (initialMessages) {
        // Now TypeScript knows initialMessages is Message[]
        setMessages(initialMessages);
      }

      // Set up real-time subscription
      const subscription = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          (payload) => {
            const newMessage = payload.new as Message;
            setMessages(current => {
              if (current.some(msg => msg.id === newMessage.id)) {
                return current;
              }
              return [...current, newMessage];
            });
          }
        )
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
          setIsConnected(status === 'SUBSCRIBED');
        });

      return subscription;
    } catch (error) {
      console.error('Error setting up realtime:', error);
      return null;
    }
  }, []);

  // Handle initial client-side setup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    const storedUsername = localStorage.getItem('chatUsername') || '';
    
    // Check system preference first
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Then check stored preference
    const storedDarkMode = localStorage.getItem('darkMode');
    
    setUsername(storedUsername);
    // Use stored preference if it exists, otherwise use system preference
    const shouldBeDark = storedDarkMode !== null ? storedDarkMode === 'true' : systemPrefersDark;
    setIsDarkMode(shouldBeDark);
    
    // Immediately set the dark class
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Set up real-time subscriptions and load initial messages
  useEffect(() => {
    if (!mounted) return;

    let subscription: RealtimeChannel | null = null;

    const initializeRealtime = async () => {
      try {
        // Clean up any existing subscription
        if (subscription) {
          await supabase.removeChannel(subscription);
        }
        subscription = await setupRealtime();
      } catch (error) {
        console.error('Error initializing realtime:', error);
      }
    };

    initializeRealtime();

    // Cleanup function
    return () => {
      if (subscription) {
        console.log('Cleaning up subscription');
        supabase.removeChannel(subscription);
      }
    };
  }, [mounted, setupRealtime]);

  // Handle user presence
  useEffect(() => {
    if (!mounted || !username) return;

    const presenceChannel = supabase.channel('online_users', {
      config: {
        presence: {
          key: username,
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const userList = Object.keys(state);
        setOnlineUsers(userList);
        setIsConnected(true);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setOnlineUsers((current) => Array.from(new Set([...current, key])));
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setOnlineUsers((current) => current.filter((u) => u !== key));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [username, mounted]);

  // Handle dark mode changes
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem('darkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, mounted]);

  // System preference listener
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  // Persist username
  const handleSetUsername = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem('chatUsername', newUsername);
  };

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const sendMessage = async (content: string) => {
    if (!username) return;

    try {
      const message: Message = {
        id: generateUniqueId(),
        username,
        content,
        timestamp: Date.now(),
      };

      // Optimistic update
      setMessages(current => [...current, message]);

      // Convert Message to Record<string, unknown> for Supabase
      const messageRecord: Record<string, unknown> = {
        id: message.id,
        username: message.username,
        content: message.content,
        timestamp: message.timestamp,
      };

      const { error } = await supabase
        .from('messages')
        .insert([messageRecord]);

      if (error) {
        console.error('Error sending message:', error);
        // Revert optimistic update on error
        setMessages(current => current.filter(msg => msg.id !== message.id));
        throw error;
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Don't render children until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <ChatContext.Provider value={{
      username,
      setUsername: handleSetUsername,
      messages,
      sendMessage,
      isConnected,
      onlineUsers,
      isDarkMode,
      toggleDarkMode,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
