'use client';

import { IconGridDots } from '@tabler/icons-react';
import {
  Bell,
  Grip,
  LayoutDashboard,
  Users,
  Settings,
  Cog,
  Warehouse,
  FileText,
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const SpringBoard = () => {
  const pathname = usePathname();
  
  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/overview',
      basePath: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'User Management',
      href: '/user-management/users',
      basePath: '/user-management/users',
      icon: Users,
    },
    {
      title: 'Master Management',
      href: '/master-management/master-schema',
      basePath: '/master-management',
      icon: Settings,
    },
    {
      title: 'Config Management',
      href: '/config-management',
      basePath: '/config-management',
      icon: Cog,
    },
    {
      title: 'Warehouse Management',
      href: '/warehouse-management/warehouse',
      basePath: '/warehouse-management',
      icon: Warehouse,
    },
    {
      title: 'Reports',
      href: '/reports',
      basePath: '/reports',
      icon: FileText,
    },
  ];

  const isActive = (basePath: string) => {
    return pathname.startsWith(basePath);
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-neutral-500">
        <Popover>
          <PopoverTrigger asChild>
            <button className="cursor-pointer rounded p-1 transition-colors hover:bg-neutral-300">
              <Grip className="h-6 w-6" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2">
            <div className="grid gap-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.basePath);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-freshleaf text-neutral-100"
                        : "text-neutral-800 hover:bg-freshleaf hover:text-neutral-100"
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
        <button className="cursor-pointer rounded p-1 transition-colors hover:bg-neutral-300">
          <Bell className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default SpringBoard;
