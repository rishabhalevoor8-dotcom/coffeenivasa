import { ShoppingBag, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function FloatingOrderButton() {
  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
      <Link
        to="/order"
        className={cn(
          'w-14 h-14 rounded-full bg-gold text-gold-foreground',
          'flex items-center justify-center',
          'shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200'
        )}
        aria-label="Order Now"
      >
        <ShoppingBag className="w-6 h-6" />
      </Link>
    </div>
  );
}

export function MobileActionBar() {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 100, damping: 15 }}
    >
      <div className="grid grid-cols-2">
        <motion.div whileHover={{ backgroundColor: 'hsl(var(--gold) / 0.9)' }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/order"
            className="flex flex-col items-center justify-center py-3 bg-gold text-gold-foreground"
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ShoppingBag className="w-5 h-5 mb-1" />
            </motion.div>
            <span className="text-xs font-medium">Order Here</span>
          </Link>
        </motion.div>
        <motion.a
          href="https://maps.google.com/?q=Coffee+Nivasa,+Doddanekundi,+Bangalore"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-3 text-foreground hover:bg-secondary transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <MapPin className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Directions</span>
        </motion.a>
      </div>
    </motion.div>
  );
}
