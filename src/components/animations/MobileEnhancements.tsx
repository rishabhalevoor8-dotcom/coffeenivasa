import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TouchFeedbackProps {
  children: ReactNode;
  className?: string;
  onTap?: () => void;
}

export function TouchFeedback({ children, className, onTap }: TouchFeedbackProps) {
  return (
    <motion.div
      className={className}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onTap={onTap}
    >
      {children}
    </motion.div>
  );
}

interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  progress: number;
}

export function PullToRefreshIndicator({ isPulling, progress }: PullToRefreshIndicatorProps) {
  return (
    <motion.div
      className="flex justify-center py-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: isPulling ? 1 : 0, 
        height: isPulling ? 'auto' : 0,
        rotate: progress * 360
      }}
    >
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </motion.div>
  );
}

interface SwipeCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export function SwipeCard({ children, onSwipeLeft, onSwipeRight, className }: SwipeCardProps) {
  return (
    <motion.div
      className={className}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        if (info.offset.x < -100 && onSwipeLeft) {
          onSwipeLeft();
        } else if (info.offset.x > 100 && onSwipeRight) {
          onSwipeRight();
        }
      }}
    >
      {children}
    </motion.div>
  );
}

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: ReactNode;
  label?: string;
  count?: number;
  className?: string;
}

export function FloatingActionButton({ onClick, icon, label, count, className }: FloatingActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`fixed bottom-24 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-full 
        bg-primary text-primary-foreground shadow-lg ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {icon}
      {label && <span className="font-medium">{label}</span>}
      {count !== undefined && count > 0 && (
        <motion.span
          className="absolute -top-2 -right-2 w-6 h-6 bg-gold text-gold-foreground rounded-full 
            flex items-center justify-center text-xs font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {count}
        </motion.span>
      )}
    </motion.button>
  );
}

interface BottomSheetIndicatorProps {
  className?: string;
}

export function BottomSheetIndicator({ className }: BottomSheetIndicatorProps) {
  return (
    <div className={`flex justify-center pt-2 pb-4 ${className}`}>
      <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
    </div>
  );
}

interface HapticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function HapticButton({ children, onClick, className, variant = 'primary' }: HapticButtonProps) {
  const handleClick = () => {
    // Trigger haptic feedback on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onClick?.();
  };

  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'bg-transparent hover:bg-muted'
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`px-4 py-2 rounded-xl font-medium transition-colors ${variantStyles[variant]} ${className}`}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}
