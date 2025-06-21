'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Tabs as TabsStyled } from '@/components/ui/tabs-styled';

const tabs = [
  {
    title: 'PJP',
    value: 'pjp',
  },
  {
    title: 'Attendance',
    value: 'attendance',
  },
  {
    title: 'History',
    value: 'history',
  },
];

export default function PjpTab() {
  const router = useRouter();
  const pathname = usePathname();
  const currentTab =
    tabs.find((tab) => pathname?.includes(tab.value))?.value || tabs[0].value;

  const handleTabChange = (value: string) => {
    router.push(`/dashboard/journey-plan/${value}`);
  };

  return (
    <TabsStyled
      tabs={tabs}
      currentTab={currentTab}
      onTabChange={handleTabChange}
      containerClassName="w-full max-w-xs"
    />
  );
}
