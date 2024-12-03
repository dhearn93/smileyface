'use client';

import { useChat } from '../context/ChatContext';

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useChat();
  
  return (
    <header className="relative py-6 text-center">
      <div className="absolute right-4 top-4">
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-accent-light dark:bg-accent-dark hover:opacity-90 transition-all duration-200 shadow-md"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-2 text-foreground">
        😊.chat
      </h1>
      <h2 className="text-2xl text-gray-400 dark:text-gray-300">
        Emoji-only Chat for Everyone
      </h2>
    </header>
  );
}
