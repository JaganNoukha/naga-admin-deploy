'use client';

import { ChevronDown, LogOut } from 'lucide-react';
import {
  IconUsers,
  IconShieldLock,
  IconUsersGroup,
} from '@tabler/icons-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface SubMenuItem {
  title: string;
  path?: string;
  items: {
    title: string;
    path: string;
  }[];
}

interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  submenu?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Users',
    icon: IconUsers,
    path: '/user-management/users',
  },
  {
    title: 'Permission Groups',
    icon: IconUsersGroup,
    path: '/user-management/permission-groups',
  },
  {
    title: 'Permissions',
    icon: IconShieldLock,
    path: '/user-management/permissions',
  },
];

export function UserSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isMenuItemActive = (item: MenuItem) => {
    if (item.submenu) {
      return (
        pathname.startsWith(item.path || '') ||
        item.submenu.some(
          (submenuItem) =>
            pathname.startsWith(submenuItem.path || '') ||
            submenuItem.items.some((subItem) => pathname === subItem.path)
        )
      );
    }
    return pathname === item.path;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center p-2">
        <img src="/naga-logo.png" alt="logo" className="h-auto w-20" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="pb-3">
            User Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={cn(
                      'w-full justify-between',
                      isMenuItemActive(item) && 'bg-freshleaf text-white'
                    )}
                    asChild
                  >
                    <Link href={item.path || '#'}>
                      <div className="flex items-center gap-2">
                        {item.icon && (
                          <item.icon
                            className={cn(
                              'h-5 w-5',
                              isMenuItemActive(item) && 'text-white'
                            )}
                          />
                        )}
                        <span>{item.title}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-4 text-sm">
          <div className="font-semibold text-zinc-500">Profile</div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
              <div className="text-freshleaf text-2xl font-semibold">L</div>
            </div>
            <div>
              <div>Legolas Greenleaf</div>
              <div className="text-xs text-zinc-500">legolas@greenleaf.com</div>
            </div>
          </div>
          <button className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-zinc-200 px-2 py-1 text-sm font-medium text-zinc-800 transition-all duration-300 hover:bg-red-200 hover:text-red-400">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
} 