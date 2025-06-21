'use client';

import { useState } from 'react';
import SpringBoard from '@/components/shared/spring-board';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import OrdersSection from '@/components/orders/orders/orders';
import SalesReturnSection from '@/components/orders/sales-return/sales-return';

export default function OrdersPage() {
  const [tab, setTab] = useState('orders');

  const tabTriggerBase =
    'flex flex-row justify-center items-center px-4 py-2 gap-2 min-w-[87px] h-[44px] rounded-lg font-poppins text-[16px] leading-6 text-center transition-colors duration-150 flex-none !border-none !shadow-none';
  const selectedTab =
    'font-medium !bg-[#D0FBE8] !text-[#00A846]';
  const unselectedTab =
    '!bg-white !text-black';

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Orders</div>
        <SpringBoard />
      </div>
      <div className="w-full rounded-lg bg-white p-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4 bg-transparent p-0 gap-2">
            <TabsTrigger
              value="orders"
              className={`${tabTriggerBase} ${tab === 'orders' ? selectedTab : unselectedTab}`}
            >
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="sales-return"
              className={`${tabTriggerBase} ${tab === 'sales-return' ? selectedTab : unselectedTab}`}
            >
              Sales Return
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <OrdersSection />
          </TabsContent>
          <TabsContent value="sales-return">
            <SalesReturnSection />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
