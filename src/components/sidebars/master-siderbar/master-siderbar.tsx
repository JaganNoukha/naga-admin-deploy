'use client';

import { ChevronDown, LogOut } from 'lucide-react';
import {
  IconDatabaseCog,
  IconFileTextShield,
  IconTopologyStar3,
} from '@tabler/icons-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMasterGroups } from '@/features/master-managment/hooks/useMasterGroups';
import { useQuery } from '@tanstack/react-query';
import { masterSchemaApi } from '@/features/master-managment/api/master-schema';

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
import Loading from '@/components/ui/loading';

interface Group {
  groupId: string;
  groupName: string;
  displayName: string;
}

interface SubMenuItem {
  groupId?: string;
  title: string;
  path?: string;
  items: {
    title: string;
    path: string;
  }[];
}

interface MenuItem {
  title: string;
  icon?: any;
  path?: string;
  submenu?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Master Schema',
    icon: IconDatabaseCog,
    path: '/master-management/master-schema',
  },
  {
    title: 'Master Groups',
    icon: IconTopologyStar3,
    path: '/master-management/master-groups',
  },
  {
    title: 'Master Records',
    icon: IconFileTextShield,
    path: '/master-management/master-records',
    submenu: [],
  },
];

export function MasterSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { groups } = useMasterGroups();

  const [currentMenuItems, setCurrentMenuItems] =
    useState<MenuItem[]>(menuItems);

  useEffect(() => {
    if (groups.data?.data?.length > 0) {
      setCurrentMenuItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[2] = {
          ...updatedItems[2],
          submenu: groups.data.data.map((group: Group) => ({
            ...group,
            title: group.displayName,
            path: `/master-management/master-records/${group.groupName}`,
            items: [],
          })),
        };
        return updatedItems;
      });
    }
  }, [groups.data]);

  const isSubmenuActive = (submenuItem: SubMenuItem) => {
    return (
      pathname.startsWith(submenuItem.path || '') ||
      submenuItem.items.some((item) => pathname === item.path)
    );
  };

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
    return pathname.startsWith(item.path || '');
  };

  const renderSubMenuItem = (item: {
    title: string;
    path: string;
    name: string;
    displayName: string;
  }) => {
    const currentSchemaName = searchParams.get('schemaName');
    const isActive = currentSchemaName === item.name;

    return (
      <li key={item.name}>
        <SidebarMenuSubButton asChild isActive={isActive}>
          <Link
            href={`/master-management/master-records?schemaName=${item.name}`}
          >
            <span>{item.displayName}</span>
          </Link>
        </SidebarMenuSubButton>
      </li>
    );
  };

  const SubmenuComponent = ({ submenuItem }: { submenuItem: SubMenuItem }) => {
    const currentSchemaName = searchParams.get('schemaName');
    const isActive = isSubmenuActive(submenuItem);
    const [isExpanded, setIsExpanded] = useState(false);

    const schemas = useQuery({
      queryKey: ['master-schemas-by-group', submenuItem?.groupId],
      queryFn: ({ queryKey }) =>
        masterSchemaApi.getSchemasByGroupId(queryKey[1] as string),
      enabled: !!submenuItem?.groupId,
    });

    const hasActiveSchema = currentSchemaName && schemas.data?.data?.some((schema: any) => schema.name === currentSchemaName);

    useEffect(() => {
      if (isActive || hasActiveSchema) {
        setIsExpanded(true);
      }
    }, [isActive, hasActiveSchema]);

    const handleTriggerClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsExpanded((prev) => !prev);
    };

    return (
      <Collapsible open={isExpanded} className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={cn(
              'w-full justify-between',
              hasActiveSchema && 'bg-freshleaf text-white'
            )}
            onClick={handleTriggerClick}
          >
            <div className="flex items-center gap-2">
              <span>{submenuItem.title}</span>
            </div>
            <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]/collapsible:-rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-1">
          <SidebarMenuSub className="space-y-1">
            {schemas.isLoading ? (
              <Loading
                iconClassName="h-5 w-5"
                className="text-xs text-zinc-500"
              />
            ) : (
              <>
                {Array.isArray(schemas?.data?.data) &&
                  schemas.data.data.map((item: any) => renderSubMenuItem(item))}
              </>
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const renderSubmenu = (submenuItem: SubMenuItem) => {
    return <SubmenuComponent submenuItem={submenuItem} />;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center p-2">
        <img src="/naga-logo.png" alt="logo" className="h-auto w-20" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="pb-3">
            Master Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {currentMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <Collapsible
                      defaultOpen={isMenuItemActive(item)}
                      className="group/collapsible2"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            'w-full justify-between',
                            isMenuItemActive(item) && 'bg-freshleaf text-white'
                          )}
                        >
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
                          <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]/collapsible2:-rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-3 pl-4">
                        <SidebarMenu className="space-y-1">
                          {groups.isLoading ? (
                            <Loading
                              iconClassName="h-5 w-5"
                              className="text-xs"
                            />
                          ) : (
                            item.submenu?.map((submenuItem) => (
                              <SidebarMenuItem key={submenuItem.title}>
                                {renderSubmenu(submenuItem)}
                              </SidebarMenuItem>
                            ))
                          )}
                        </SidebarMenu>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
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
                  )}
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
