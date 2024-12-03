'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import { useVirtualizer } from '@tanstack/react-virtual';
import { VirtualItem } from '@tanstack/react-virtual';

export default function ChatRoom() {
  const { messages, sendMessage, username, onlineUsers, isDarkMode, toggleDarkMode } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [isUserListOpen, setIsUserListOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
    paddingStart: 8,
    paddingEnd: 8
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setError(null);

    try {
      await sendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-full gap-4">
      <div className="flex-1 flex flex-col">
        <div
          ref={parentRef}
          className="flex-1 overflow-y-auto px-2"
          style={{
            height: 'calc(100vh - 12rem)',
            willChange: 'transform',
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow: VirtualItem) => (
              <div
                key={messages[virtualRow.index].id}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: `${virtualRow.start}px`,
                  left: 0,
                  width: '100%',
                  minHeight: `${virtualRow.size}px`,
                }}
              >
                <MessageBubble
                  {...messages[virtualRow.index]}
                  isCurrentUser={messages[virtualRow.index].username === username}
                />
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="text-red-500 mb-2 text-sm">
            {error}
          </div>
        )}
        
        {/* Message input form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            className={`flex-1 px-4 py-2 rounded-2xl border ${
              isDarkMode 
                ? 'bg-primary-dark border-gray-600 text-white' 
                : 'bg-primary-light border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Type your emoji message..."
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-secondary-light to-accent-light dark:from-secondary-dark dark:to-accent-dark text-foreground rounded-2xl hover:opacity-90 transition-opacity"
          >
            Send
          </button>
        </form>
      </div>

      {/* Collapsible user list */}
      <div className={`transition-all duration-300 flex ${isUserListOpen ? 'w-64' : 'w-12'}`}>
        <div className={`${isUserListOpen ? 'w-64' : 'w-0'} overflow-hidden transition-all duration-300`}>
          <div className="bg-accent-light dark:bg-accent-dark rounded-3xl shadow-lg p-4 h-full">
            <div className="flex justify-between items-center mb-4">
              <div className={`transition-opacity duration-300 ${isUserListOpen ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="font-semibold">Online Users</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {onlineUsers.length} online
                </p>
              </div>
            </div>
            <ul className={`space-y-2 max-h-[calc(80vh-8rem)] overflow-y-auto transition-opacity duration-300 ${isUserListOpen ? 'opacity-100' : 'opacity-0'}`}>
              {onlineUsers.length > 0 ? (
                onlineUsers.map((user) => (
                  <li
                    key={`user-${user}`}
                    className={`p-2 rounded-xl flex items-center justify-between ${
                      user === username
                        ? 'bg-blue-100 dark:bg-blue-900'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-lg break-all">{user}</span>
                    </div>
                    {user === username && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                        (you)
                      </span>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-500 dark:text-gray-400">
                  No users online
                </li>
              )}
            </ul>
          </div>
        </div>
        {/* Toggle button */}
        <button
          onClick={() => setIsUserListOpen(prev => !prev)}
          className="ml-2 p-2 h-12 bg-accent-light dark:bg-accent-dark rounded-xl shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center"
          aria-label={isUserListOpen ? 'Hide user list' : 'Show user list'}
        >
          {isUserListOpen ? '👥' : '👤'}
        </button>
      </div>
    </div>
  );
}
