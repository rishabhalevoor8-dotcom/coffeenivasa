import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MenuSkeletonProps {
  count?: number;
  className?: string;
}

export function MenuItemSkeleton({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "bg-card rounded-2xl p-4 shadow-card border border-border",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Veg/Non-veg indicator skeleton */}
        <div className="w-5 h-5 rounded-sm bg-muted animate-shimmer flex-shrink-0" />
        
        <div className="flex-1 min-w-0 space-y-2">
          {/* Name skeleton */}
          <div className="h-5 bg-muted rounded-md animate-shimmer w-3/4" />
          
          {/* Price skeleton */}
          <div className="h-5 bg-muted rounded-md animate-shimmer w-1/3" />
        </div>
        
        {/* Add button skeleton */}
        <div className="w-10 h-10 rounded-full bg-muted animate-shimmer flex-shrink-0" />
      </div>
    </motion.div>
  );
}

export function CategoryTabsSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="flex-shrink-0 h-10 w-24 rounded-full bg-muted animate-shimmer"
        />
      ))}
    </div>
  );
}

export function MenuSkeleton({ count = 6, className }: MenuSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <MenuItemSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-card rounded-2xl p-6 shadow-card border border-border",
      className
    )}>
      <div className="space-y-4">
        <div className="h-40 bg-muted rounded-xl animate-shimmer" />
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded-md animate-shimmer w-3/4" />
          <div className="h-4 bg-muted rounded-md animate-shimmer w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-2xl p-6 shadow-card border border-border"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-muted animate-shimmer" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded-md animate-shimmer w-1/2" />
          <div className="h-3 bg-muted rounded-md animate-shimmer w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded-md animate-shimmer w-full" />
        <div className="h-3 bg-muted rounded-md animate-shimmer w-5/6" />
        <div className="h-3 bg-muted rounded-md animate-shimmer w-4/6" />
      </div>
    </motion.div>
  );
}
