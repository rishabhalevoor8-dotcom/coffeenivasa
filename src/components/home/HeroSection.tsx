import { ShoppingBag, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FloatingElement } from '@/components/animations';
import heroBg from '@/assets/hero-bg.jpg';

const trustIndicators = [
  { text: 'Veg & Non-Veg', icon: '🍽️' },
  { text: 'Open All Days', icon: '📅' },
  { text: 'Dine-in', icon: '🪑' },
  { text: 'Takeaway', icon: '📦' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 15,
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <img
          src={heroBg}
          alt="Coffee Nivasa Café Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </motion.div>

      {/* Decorative Floating Elements */}
      <FloatingElement className="absolute top-20 left-10 opacity-20 text-6xl hidden md:block" duration={4} delay={0}>
        ☕
      </FloatingElement>
      <FloatingElement className="absolute top-40 right-20 opacity-15 text-5xl hidden md:block" duration={5} delay={1}>
        🍰
      </FloatingElement>
      <FloatingElement className="absolute bottom-40 left-20 opacity-15 text-4xl hidden md:block" duration={4.5} delay={0.5}>
        🥐
      </FloatingElement>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 pt-32 text-center">
        <motion.div
          className="max-w-3xl mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={badgeVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20"
          >
            <motion.span
              className="text-gold text-lg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              ☕
            </motion.span>
            <span className="text-sm font-medium text-primary-foreground/90">Est. 2026 • Premium Café</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground leading-tight"
          >
            Coffee Nivasa –{' '}
            <span className="text-gradient-gold">Where Every Sip Feels Like Home</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-primary-foreground/80 max-w-xl mx-auto"
          >
            Café & Restaurant in Doddanekundi, Bangalore
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="gold" size="lg" asChild>
                <Link to="/order">
                  <ShoppingBag className="w-5 h-5" />
                  Order Now
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="heroOutline" size="lg" asChild>
                <a
                  href="https://maps.google.com/?q=Coffee+Nivasa,+Doddanekundi,+Bangalore"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="w-5 h-5" />
                  Get Directions
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 pt-8">
            {trustIndicators.map((item, index) => (
              <motion.div
                key={item.text}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-sm text-primary-foreground/90"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.span
          className="text-xs text-primary-foreground/60 uppercase tracking-wider"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll
        </motion.span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex items-start justify-center p-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-3 bg-primary-foreground/60 rounded-full"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
