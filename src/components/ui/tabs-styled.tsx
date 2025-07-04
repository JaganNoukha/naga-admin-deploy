'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  onTabChange,
  currentTab,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  onTabChange?: (value: string) => void;
  currentTab?: string;
}) => {
  const getActiveTab = () => {
    if (currentTab) {
      return propTabs.find(tab => tab.value === currentTab) || propTabs[0];
    }
    return propTabs[0];
  };

  const [active, setActive] = useState<Tab>(getActiveTab());
  const [tabs, setTabs] = useState<Tab[]>(propTabs);

  useEffect(() => {
    if (currentTab) {
      const newActiveTab = propTabs.find(tab => tab.value === currentTab);
      if (newActiveTab && newActiveTab.value !== active.value) {
        setActive(newActiveTab);
        const activeIndex = propTabs.findIndex(tab => tab.value === currentTab);
        if (activeIndex > 0) {
          const newTabs = [...propTabs];
          const selectedTab = newTabs.splice(activeIndex, 1);
          newTabs.unshift(selectedTab[0]);
          setTabs(newTabs);
        }
      }
    }
  }, [currentTab, propTabs, active.value]);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
    
    if (onTabChange) {
      onTabChange(newTabs[0].value);
    }
  };

  const [hovering, setHovering] = useState(false);

  return (
    <>
      <div
        className={cn(
          'no-visible-scrollbar relative flex w-full max-w-full flex-row items-center justify-start overflow-auto [perspective:1000px] sm:overflow-visible',
          containerClassName
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.title}
            onClick={() => {
              moveSelectedTabToTop(idx);
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn('relative px-4 py-2  cursor-pointer', tabClassName)}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                className={cn(
                  'absolute inset-0 rounded-md bg-freshleaf/20',
                  activeTabClassName
                )}
              />
            )}

            <span className={cn('relative block', active.value === tab.value ? ' text-freshleaf' : '')}>
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <FadeInDiv
        tabs={tabs}
        active={active}
        key={active.value}
        hovering={hovering}
        className={cn('mt-32', contentClassName)}
      />
    </>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  hovering,
}: {
  className?: string;
  key?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  const isActive = (tab: Tab) => {
    return tab.value === tabs[0].value;
  };
  return (
    <div className="relative h-full w-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: 1 - idx * 0.1,
            top: hovering ? idx * -50 : 0,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 40, 0] : 0,
          }}
          className={cn('absolute top-0 left-0 h-full w-full', className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};
