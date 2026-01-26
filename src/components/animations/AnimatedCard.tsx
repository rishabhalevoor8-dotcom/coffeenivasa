import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  hoverY?: number;
}

export function AnimatedCard({
  children,
  className = '',
  hoverScale = 1.02,
  hoverY = -5,
}: AnimatedCardProps) {
  return (
    <motion.div
      className={cn('cursor-pointer', className)}
      whileHover={{
        scale: hoverScale,
        y: hoverY,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}
