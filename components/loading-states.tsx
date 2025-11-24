"use client"

import { useEffect, useState } from 'react';
import { Bot, Loader2, Search, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const STATES = [
  { icon: Search, text: 'Finding the best response...' },
  { icon: Sparkles, text: 'Thinking...' },
  { icon: Loader2, text: 'Generating answer...' }
];

export function LoadingStates() {
  const [stateIndex, setStateIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStateIndex((prev) => (prev + 1) % STATES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = STATES[stateIndex].icon;

  return (
    <div className="flex gap-4">
      <Avatar className="w-8 h-8 mt-1 flex-shrink-0">
        <AvatarFallback className="bg-green-500">
          <Bot className="w-4 h-4 text-white" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="font-semibold text-sm text-gray-800 dark:text-white mb-2">AI Assistant</div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <CurrentIcon className="w-4 h-4 animate-spin" />
          <span className="text-sm">{STATES[stateIndex].text}</span>
        </div>
      </div>
    </div>
  );
}
