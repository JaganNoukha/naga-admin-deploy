'use client';

import { Button } from '@/components/ui/button';

import SpringBoard from '@/components/shared/spring-board';
import PjpTab from '@/components/tabs/pjp/pjp-tabs';
import { cn } from '@/lib/utils';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
  setMonth,
  setYear,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DAYS_OF_WEEK } from '@/constants/commons';
import { WarehouseDropdown } from '@/components/shared/warehouse-dropdown';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateMonthOptions } from '@/utils/common-utils';

const JourneyPlanPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>();
  const [selectedDesignation, setSelectedDesignation] = useState<string>();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), 'MM')
  );

  const monthOptions = generateMonthOptions();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate =
        direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1);
      setSelectedMonth(format(newDate, 'MM'));
      return newDate;
    });
  };

  const handleMonthChange = (monthValue: string) => {
    setSelectedMonth(monthValue);
    const currentYear = new Date().getFullYear();
    const newDate = new Date(currentYear, parseInt(monthValue) - 1, 1);
    setCurrentDate(newDate);
  };

  const isDayInCurrentMonth = (day: Date) => {
    return day >= monthStart && day <= monthEnd;
  };
  
  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Permanent Journey Plan</div>
        <SpringBoard />
      </div>

      <div className="w-full space-y-2 rounded-lg bg-white p-4">
        <PjpTab />
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="flex flex-col gap-2 md:flex-row">
            <WarehouseDropdown
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="Warehouse"
            />
            <Select
              value={selectedDesignation}
              onValueChange={setSelectedDesignation}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sales Person" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Amruth</SelectItem>
                <SelectItem value="manager">Kiran</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="w-full rounded-lg bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-medium">Attendance Calendar</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="tertiary"
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="tertiary"
              size="icon"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mb-3 flex w-full items-center gap-2 font-semibold">
          <div className="bg-background flex w-full justify-center rounded-md p-5">
            Leave: 05
          </div>
          <div className="bg-background flex w-full justify-center rounded-md p-5">
            Attendance: 05
          </div>
          <div className="bg-background flex w-full justify-center rounded-md p-5">
            Month: {format(currentDate, 'MMMM yyyy')}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className={cn(
                'bg-background flex h-12 items-center justify-center rounded-md font-medium'
              )}
            >
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={cn(
                'h-24 rounded-md border-2 border-neutral-200 p-2 transition-colors hover:bg-gray-50',
                isDayInCurrentMonth(day) ? 'bg-white' : 'bg-neutral-100',
                isToday(day) && 'border-freshleaf bg-freshleaf/10'
              )}
            >
              <div className={cn('flex h-full flex-col justify-between')}>
                <span
                  className={cn(
                    'text-base font-semibold',
                    isToday(day) && 'text-freshleaf',
                    isDayInCurrentMonth(day) &&
                      !isToday(day) &&
                      'text-gray-900',
                    !isDayInCurrentMonth(day) && 'text-gray-400'
                  )}
                >
                  {format(day, 'd')}
                </span>
                <div className={cn('')}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneyPlanPage;
