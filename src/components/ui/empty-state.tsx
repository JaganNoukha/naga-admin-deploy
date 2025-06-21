import { cn } from '@/lib/utils';
import { IconDog } from '@tabler/icons-react';

interface EmptyStateProps {
  text?: string;
  className?: string;
  iconClassName?: string;
}

const EmptyState = ({ 
  text = "Wow! Such empty.", 
  className = "",
  iconClassName = "" 
}: EmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-1", className)}>
      <IconDog className={cn("h-15 w-15 text-neutral-400", iconClassName)} />
      <p className="text-base text-neutral-400 text-center">{text}</p>
    </div>
  );
};

export default EmptyState; 