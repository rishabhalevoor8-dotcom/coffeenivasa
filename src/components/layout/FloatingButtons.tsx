import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919663025408?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Coffee%20Nivasa"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40',
        'w-14 h-14 rounded-full bg-[#25D366] text-white',
        'flex items-center justify-center',
        'shadow-lg hover:shadow-xl transition-all duration-300',
        'hover:scale-110 animate-float'
      )}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" fill="currentColor" />
    </a>
  );
}

export function MobileActionBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border">
      <div className="grid grid-cols-3">
        <a
          href="tel:9663025408"
          className="flex flex-col items-center justify-center py-3 text-foreground hover:bg-secondary transition-colors"
        >
          <Phone className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Call</span>
        </a>
        <a
          href="https://wa.me/919663025408?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Coffee%20Nivasa"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-3 bg-[#25D366] text-white"
        >
          <MessageCircle className="w-5 h-5 mb-1" fill="currentColor" />
          <span className="text-xs font-medium">WhatsApp</span>
        </a>
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
