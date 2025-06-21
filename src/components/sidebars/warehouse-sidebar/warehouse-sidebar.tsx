'use client';

import { LogOut, Warehouse } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

const items = [
  {
    title: 'Warehouse',
    url: '/warehouse-management/warehouse',
    icon: Warehouse,
  },
  
];

export function WarehouseSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-2">
        <img src="/naga-logo.png" alt="logo" className="h-auto w-20" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="pb-3">Warehouse Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={isActive} asChild>
                      <Link href={item.url}>
                        <item.icon className="!h-5 !w-5" />
                        <span className="">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-4 text-sm">
          <div className="font-semibold text-zinc-500">Profile</div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
              <div className="text-freshleaf text-2xl font-semibold">G</div>
            </div>
            <div>
              <div>Gandalf The Grey</div>
              <div className="text-xs text-zinc-500">gandalf@wizard.in</div>
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
