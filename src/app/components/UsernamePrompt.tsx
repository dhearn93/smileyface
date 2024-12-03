'use client';

import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { validateUsername } from '../lib/validators';

export default function UsernamePrompt() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const { setUsername } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateUsername(input);
    
    if (!validation.valid) {
      setError(validation.message || 'Invalid username');
      return;
    }

    setUsername(input);
  };

  return (
    <div className="w-full max-w-md p-8 bg-primary-light dark:bg-primary-dark rounded-3xl shadow-lg transform transition-all duration-500">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            Enter your emoji username to join the chat!
          </label>
          <input
            type="text"
            id="username"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="😊"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-secondary-light to-accent-light dark:from-secondary-dark dark:to-accent-dark text-foreground rounded-2xl hover:opacity-90 transition-opacity"
        >
          Join Chat
        </button>
      </form>
    </div>
  );
}
