import { Clock } from 'lucide-react';
import { formatTime } from '@/hooks/useShopStatus';

interface ShopClosedBannerProps {
  openTime: string;
  closeTime: string;
}

export function ShopClosedBanner({ openTime, closeTime }: ShopClosedBannerProps) {
  const formattedOpen = formatTime(openTime);
  const formattedClose = closeTime === '00:00' ? '12:00 AM' : formatTime(closeTime);

  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
        <Clock className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="font-display text-xl font-bold text-foreground mb-2">
        We're Currently Closed
      </h3>
      <p className="text-muted-foreground">
        Open from <span className="font-semibold text-foreground">{formattedOpen}</span> to{' '}
        <span className="font-semibold text-foreground">{formattedClose}</span>
      </p>
    </div>
  );
}
