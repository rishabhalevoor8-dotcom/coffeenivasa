import { ShoppingBag, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function FloatingOrderButton() {
  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      >
        <Link
          to="/order"
          className={cn(
            'w-14 h-14 rounded-full bg-gold text-gold-foreground',
            'flex items-center justify-center',
            'shadow-lg hover:shadow-xl transition-shadow duration-200'
          )}
          aria-label="Order Now"
        >
          <motion.div
            whileHover={{ scale: 1.15, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingBag className="w-6 h-6" />
          </motion.div>
        </Link>
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-gold/40"
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
      </motion.div>
    </div>
  );
}

export function MobileActionBar() {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
    >
      <div className="grid grid-cols-2">
        <Link
          to="/order"
          className="flex flex-col items-center justify-center py-3 bg-gold text-gold-foreground active:opacity-90 transition-opacity"
        >
          <ShoppingBag className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Order Here</span>
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
    </motion.div>
  );
}
