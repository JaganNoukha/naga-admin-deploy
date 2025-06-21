'use client';

import { LogOut } from 'lucide-react';
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
import {
  IconBuildingStore,
  IconCoinRupee,
  IconFileDatabase,
  IconMapRoute,
  IconPackage,
  IconPresentation,
  IconShoppingCart,
} from '@tabler/icons-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppSelector } from '@/store/hooks';

const items = [
  {
    title: 'Overview',
    url: '/dashboard/overview',
    icon: IconPresentation,
  },
  {
    title: 'Outlets',
    url: '/dashboard/outlets',
    icon: IconBuildingStore,
  },
  {
    title: 'PJP',
    url: '/dashboard/journey-plan',
    icon: IconMapRoute,
  },
  {
    title: 'Orders',
    url: '/dashboard/orders',
    icon: IconShoppingCart,
  },
  {
    title: 'Products',
    url: '/dashboard/products',
    icon: IconPackage,
  },
  {
    title: 'Claims',
    url: '/dashboard/claims',
    icon: IconCoinRupee,
  },
  {
    title: 'Schemes',
    url: '/dashboard/schemes',
    icon: IconFileDatabase,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    signOut();
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-2">
        <img src="/naga-logo.png" alt="logo" className="h-auto w-20" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="pb-3">Menu</SidebarGroupLabel>
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
              <div className="text-freshleaf text-2xl font-semibold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div>
              <div>{user?.name || 'User'}</div>
              <div className="text-xs text-zinc-500">{user?.email || 'user@example.com'}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-zinc-200 px-2 py-1 text-sm font-medium text-zinc-800 transition-all duration-300 hover:bg-red-200 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
