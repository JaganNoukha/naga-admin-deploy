'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabs = [
  {
    name: 'Approval Claims',
    value: 'approval-claims',
  },
  {
    name: 'My Claims',
    value: 'my-claims',
  },
];

export default function ClaimsTab() {
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = tabs.find(tab => pathname?.includes(tab.value))?.value || tabs[0].value;

  const handleTabChange = (value: string) => {
    router.push(`/dashboard/claims/${value}`);
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="max-w-xs w-full">
      <TabsList className="p-0 h-auto bg-background gap-1">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-[rgb(0,168,84)] data-[state=active]:text-white data-[state=active]:font-semibold rounded-md px-3 py-1"
          >
            <code className="text-[13px]">{tab.name}</code>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
        </TabsContent>
      ))}
    </Tabs>
  );
} 