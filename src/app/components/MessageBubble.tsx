'use client';

import { useChat } from '../context/ChatContext';

interface MessageBubbleProps {
  username: string;
  content: string;
  timestamp: number;
  isCurrentUser: boolean;
}

export default function MessageBubble({ username, content, timestamp, isCurrentUser }: MessageBubbleProps) {
  const { isDarkMode } = useChat();
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md ${
          isCurrentUser
            ? 'bg-secondary-light dark:bg-secondary-dark text-foreground rounded-l-2xl rounded-tr-2xl'
            : isDarkMode
              ? 'bg-primary-dark text-foreground rounded-r-2xl rounded-tl-2xl'
              : 'bg-primary-light text-foreground rounded-r-2xl rounded-tl-2xl'
        } p-4 shadow-md`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">{username}</span>
          <span className={`text-xs ${isCurrentUser ? 'opacity-70' : isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-2xl break-words leading-normal">{content}</p>
      </div>
    </div>
  );
}
