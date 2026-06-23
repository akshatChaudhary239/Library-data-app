'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Grid, IndianRupee, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Students', href: '/students', icon: Users },
    { label: 'Seats', href: '/seats', icon: Grid },
    { label: 'Payments', href: '/payments', icon: IndianRupee },
    { label: 'Attendance', href: '/attendance', icon: Users },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-background border-t border-border/50 pb-safe pt-2 h-16 md:hidden">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground transition-colors hover:text-foreground',
              isActive && 'text-primary'
            )}
          >
            <item.icon className={cn('h-5 w-5', isActive && 'fill-primary/20')} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
