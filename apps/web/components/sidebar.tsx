'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Grid, IndianRupee, Settings, BookOpen, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Students', href: '/students', icon: Users },
    { label: 'Seats', href: '/seats', icon: Grid },
    { label: 'Payments', href: '/payments', icon: IndianRupee },
    { label: 'Attendance', href: '/attendance', icon: Clock },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 min-h-[calc(100vh-3.5rem)] h-full sticky top-14 pt-4 px-3 gap-2">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
          Menu
        </h2>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className={cn('h-4 w-4', isActive && 'text-primary')} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
