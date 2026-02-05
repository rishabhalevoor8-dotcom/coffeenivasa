 import { motion } from 'framer-motion';
 import { cn } from '@/lib/utils';
 
 interface LoadingSpinnerProps {
   size?: 'sm' | 'md' | 'lg';
   className?: string;
 }
 
 const sizeMap = {
   sm: 'w-4 h-4',
   md: 'w-8 h-8',
   lg: 'w-12 h-12',
 };
 
 export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
   return (
     <div className={cn('relative', sizeMap[size], className)}>
       <motion.div
         className="absolute inset-0 rounded-full border-2 border-muted"
       />
       <motion.div
         className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold"
         animate={{ rotate: 360 }}
         transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
       />
     </div>
   );
 }
 
 interface LoadingDotsProps {
   className?: string;
 }
 
 export function LoadingDots({ className }: LoadingDotsProps) {
   return (
     <div className={cn('flex items-center gap-1', className)}>
       {[0, 1, 2].map((i) => (
         <motion.div
           key={i}
           className="w-2 h-2 rounded-full bg-gold"
           animate={{ y: [0, -8, 0] }}
           transition={{
             duration: 0.6,
             repeat: Infinity,
             delay: i * 0.15,
             ease: 'easeInOut',
           }}
         />
       ))}
     </div>
   );
 }
 
 interface LoadingPulseProps {
   className?: string;
 }
 
 export function LoadingPulse({ className }: LoadingPulseProps) {
   return (
     <motion.div
       className={cn('w-full h-full bg-muted rounded-lg', className)}
       animate={{
         opacity: [0.5, 1, 0.5],
       }}
       transition={{
         duration: 1.5,
         repeat: Infinity,
         ease: 'easeInOut',
       }}
     />
   );
 }
 
 interface FullPageLoaderProps {
   message?: string;
 }
 
 export function FullPageLoader({ message = 'Loading...' }: FullPageLoaderProps) {
   return (
     <motion.div
       className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4"
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
     >
       <motion.div
         className="relative w-16 h-16"
         animate={{ rotate: 360 }}
         transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
       >
         <motion.div
           className="absolute inset-0 rounded-full border-4 border-muted"
         />
         <motion.div
           className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold border-r-gold"
           animate={{ rotate: -360 }}
           transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
         />
       </motion.div>
       <motion.p
         className="text-muted-foreground font-medium"
         animate={{ opacity: [0.5, 1, 0.5] }}
         transition={{ duration: 1.5, repeat: Infinity }}
       >
         {message}
       </motion.p>
     </motion.div>
   );
 }