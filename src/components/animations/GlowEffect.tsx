 import { motion } from 'framer-motion';
 import { ReactNode } from 'react';
 import { cn } from '@/lib/utils';
 
 interface GlowEffectProps {
   children: ReactNode;
   className?: string;
   glowColor?: string;
   intensity?: 'low' | 'medium' | 'high';
 }
 
 export function GlowEffect({
   children,
   className,
   glowColor = 'gold',
   intensity = 'medium',
 }: GlowEffectProps) {
   const intensityMap = {
     low: '0 0 20px',
     medium: '0 0 40px',
     high: '0 0 60px',
   };
 
   return (
     <motion.div
       className={cn('relative', className)}
       whileHover={{
         filter: `drop-shadow(${intensityMap[intensity]} hsl(var(--${glowColor}) / 0.4))`,
       }}
       transition={{ duration: 0.3 }}
     >
       {children}
     </motion.div>
   );
 }
 
 interface ShineEffectProps {
   children: ReactNode;
   className?: string;
 }
 
 export function ShineEffect({ children, className }: ShineEffectProps) {
   return (
     <motion.div
       className={cn('relative overflow-hidden', className)}
       whileHover="hover"
     >
       {children}
       <motion.div
         className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
         variants={{
           hover: {
             translateX: '200%',
             transition: { duration: 0.6, ease: 'easeInOut' },
           },
         }}
       />
     </motion.div>
   );
 }
 
 interface MagneticButtonProps {
   children: ReactNode;
   className?: string;
   strength?: number;
 }
 
 export function MagneticButton({ children, className, strength = 0.3 }: MagneticButtonProps) {
   return (
     <motion.div
       className={cn('inline-block', className)}
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
       transition={{ type: 'spring', stiffness: 400, damping: 17 }}
     >
       {children}
     </motion.div>
   );
 }
 
 interface ParallaxCardProps {
   children: ReactNode;
   className?: string;
   depth?: number;
 }
 
 export function ParallaxCard({ children, className, depth = 10 }: ParallaxCardProps) {
   return (
     <motion.div
       className={cn('relative', className)}
       whileHover={{
         rotateX: 5,
         rotateY: 5,
         transformPerspective: 1000,
       }}
       transition={{ type: 'spring', stiffness: 300, damping: 20 }}
       style={{ transformStyle: 'preserve-3d' }}
     >
       {children}
     </motion.div>
   );
 }
 
 interface CountUpProps {
   end: number;
   duration?: number;
   prefix?: string;
   suffix?: string;
   className?: string;
 }
 
 export function CountUp({ end, duration = 2, prefix = '', suffix = '', className }: CountUpProps) {
   return (
     <motion.span
       className={className}
       initial={{ opacity: 0 }}
       whileInView={{ opacity: 1 }}
       viewport={{ once: true }}
     >
       <motion.span
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         viewport={{ once: true }}
       >
         {prefix}
         <motion.span
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.5 }}
         >
           {end}
         </motion.span>
         {suffix}
       </motion.span>
     </motion.span>
   );
 }
 
 interface BlurRevealProps {
   children: ReactNode;
   className?: string;
   delay?: number;
 }
 
 export function BlurReveal({ children, className, delay = 0 }: BlurRevealProps) {
   return (
     <motion.div
       className={className}
       initial={{ opacity: 0, filter: 'blur(10px)' }}
       whileInView={{ opacity: 1, filter: 'blur(0px)' }}
       viewport={{ once: true }}
       transition={{ duration: 0.6, delay, ease: 'easeOut' }}
     >
       {children}
     </motion.div>
   );
 }
 
 interface TypewriterProps {
   text: string;
   className?: string;
   delay?: number;
   speed?: number;
 }
 
 export function Typewriter({ text, className, delay = 0, speed = 0.05 }: TypewriterProps) {
   return (
     <motion.span className={className}>
       {text.split('').map((char, i) => (
         <motion.span
           key={i}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: delay + i * speed }}
         >
           {char}
         </motion.span>
       ))}
     </motion.span>
   );
 }