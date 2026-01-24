import { cn } from '@/lib/utils';

export type SpiceType = 'not_spicy' | 'mild' | 'spicy';

interface SpiceIndicatorProps {
  spiceType: SpiceType;
  showLabel?: boolean;
  className?: string;
}

const spiceConfig = {
  not_spicy: {
    color: 'text-green-600',
    label: 'Not Spicy',
  },
  mild: {
    color: 'text-yellow-500',
    label: 'Mild',
  },
  spicy: {
    color: 'text-red-500',
    label: 'Spicy',
  },
};

export function SpiceIndicator({ spiceType, showLabel = true, className }: SpiceIndicatorProps) {
  const config = spiceConfig[spiceType];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <svg
        className={cn('w-4 h-4', config.color)}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C11.2 2 10.5 2.3 10 2.9C9.5 2.3 8.8 2 8 2C6.3 2 5 3.3 5 5C5 5.4 5.1 5.8 5.2 6.2C3.9 7.1 3 8.5 3 10C3 11.1 3.4 12.1 4 12.9V21C4 21.6 4.4 22 5 22H9C9.6 22 10 21.6 10 21V14.5C10.6 14.8 11.3 15 12 15C12.7 15 13.4 14.8 14 14.5V21C14 21.6 14.4 22 15 22H19C19.6 22 20 21.6 20 21V12.9C20.6 12.1 21 11.1 21 10C21 8.5 20.1 7.1 18.8 6.2C18.9 5.8 19 5.4 19 5C19 3.3 17.7 2 16 2C15.2 2 14.5 2.3 14 2.9C13.5 2.3 12.8 2 12 2Z" />
      </svg>
      {showLabel && (
        <span className={cn('text-xs font-medium', config.color)}>
          {config.label}
        </span>
      )}
    </div>
  );
}

export function getSpiceLabel(spiceType: SpiceType): string {
  return spiceConfig[spiceType].label;
}
