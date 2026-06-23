'use client';

import { TopBar } from './top-bar';
import { BottomNav } from './bottom-nav';
import { Sidebar } from './sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-background flex flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto w-full max-w-screen-2xl mx-auto p-4 md:p-8 pb-20 md:pb-8">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
