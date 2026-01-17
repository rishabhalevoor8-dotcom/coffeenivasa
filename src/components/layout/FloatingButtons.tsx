import { ShoppingBag, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function FloatingOrderButton() {
  return (
    <Link
      to="/order"
      className={cn(
        'fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40',
        'w-14 h-14 rounded-full bg-gold text-gold-foreground',
        'flex items-center justify-center',
        'shadow-lg hover:shadow-xl transition-all duration-300',
        'hover:scale-110 animate-float'
      )}
      aria-label="Order Now"
    >
      <ShoppingBag className="w-6 h-6" />
    </Link>
  );
}

export function MobileActionBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border">
      <div className="grid grid-cols-2">
        <Link
          to="/order"
          className="flex flex-col items-center justify-center py-3 bg-gold text-gold-foreground"
        >
          <ShoppingBag className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Order Now</span>
        </Link>
        <a
          href="https://maps.google.com/?q=Coffee+Nivasa,+Doddanekundi,+Bangalore"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-3 text-foreground hover:bg-secondary transition-colors"
        >
          <MapPin className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Directions</span>
        </a>
      </div>
    </div>
  );
}
