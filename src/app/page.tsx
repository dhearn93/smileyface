'use client';

import { ChatProvider } from './context/ChatContext';
import { useChat } from './context/ChatContext';
import Header from './components/Header';
import UsernamePrompt from './components/UsernamePrompt';
import ChatRoom from './components/ChatRoom';
import Footer from './components/Footer';

function ChatApp() {
  const { username } = useChat();

  return (
    <main className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 overflow-hidden">
        {!username ? <UsernamePrompt /> : <ChatRoom />}
      </div>
      <Footer />
    </main>
  );
}

export default function Home() {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
}
