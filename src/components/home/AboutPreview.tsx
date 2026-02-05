import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Leaf, Users } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem, BlurReveal } from '@/components/animations';
import cafeStorefront from '@/assets/cafe-storefront.jpg';
import cappuccinoImg from '@/assets/menu/cappuccino.jpg';
import sandwichImg from '@/assets/menu/sandwich.jpg';
import pastaImg from '@/assets/menu/pasta.jpg';

const features = [
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every dish prepared with passion and care',
  },
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description: 'Quality ingredients sourced daily',
  },
  {
    icon: Users,
    title: 'Family Friendly',
    description: 'A warm space for everyone',
  },
];

const imageHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.08,
    transition: { duration: 0.4, ease: 'easeOut' as const }
  }
};

const overlayVariants: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.3 } }
};

export function AboutPreview() {
  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <ScrollReveal direction="left">
            <div className="space-y-6">
              <motion.span
                className="inline-block text-gold font-medium text-sm uppercase tracking-wider"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Our Story
              </motion.span>
              <motion.h2
                className="font-display text-3xl md:text-4xl font-bold text-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Welcome to Coffee Nivasa
              </motion.h2>
              <BlurReveal delay={0.2}>
                <p className="text-muted-foreground leading-relaxed">
                Nestled in the heart of Doddanekundi, Bangalore, Coffee Nivasa is more than just a café – it's a haven for coffee lovers and food enthusiasts alike. Our journey began with a simple dream: to create a space where the aroma of freshly brewed coffee meets the warmth of home-cooked meals.
                </p>
              </BlurReveal>
              <BlurReveal delay={0.3}>
                <p className="text-muted-foreground leading-relaxed">
                Every cup we serve carries the essence of carefully selected beans, and every dish reflects our commitment to authentic flavors and quality ingredients.
                </p>
              </BlurReveal>

              <StaggerContainer className="grid sm:grid-cols-3 gap-4 pt-4" staggerDelay={0.15}>
                {features.map((feature) => (
                  <StaggerItem key={feature.title}>
                    <motion.div
                      className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/50 border border-transparent hover:border-gold/20"
                      whileHover={{ scale: 1.05, y: -8, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <motion.div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-3"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <feature.icon className="w-6 h-6 text-accent" />
                      </motion.div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" asChild className="mt-4">
                  <Link to="/about">
                    Learn More About Us
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Image Grid */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="relative perspective-1000">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <motion.div
                    className="h-48 rounded-2xl overflow-hidden shadow-card"
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    <motion.div className="relative w-full h-full" variants={imageHoverVariants}>
                      <img 
                        src={cafeStorefront} 
                        alt="Coffee Nivasa Café" 
                        className="w-full h-full object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-4"
                        variants={overlayVariants}
                      >
                        <span className="text-primary-foreground font-medium text-sm">Our Café</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className="h-32 rounded-2xl overflow-hidden shadow-card"
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    <motion.div className="relative w-full h-full" variants={imageHoverVariants}>
                      <img 
                        src={cappuccinoImg} 
                        alt="Fresh Coffee" 
                        className="w-full h-full object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-3"
                        variants={overlayVariants}
                      >
                        <span className="text-primary-foreground font-medium text-xs">Fresh Coffee</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
                <div className="space-y-4 pt-8">
                  <motion.div
                    className="h-32 rounded-2xl overflow-hidden shadow-card"
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    <motion.div className="relative w-full h-full" variants={imageHoverVariants}>
                      <img 
                        src={sandwichImg} 
                        alt="Delicious Sandwich" 
                        className="w-full h-full object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-3"
                        variants={overlayVariants}
                      >
                        <span className="text-primary-foreground font-medium text-xs">Sandwiches</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className="h-48 rounded-2xl overflow-hidden shadow-card"
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    <motion.div className="relative w-full h-full" variants={imageHoverVariants}>
                      <img 
                        src={pastaImg} 
                        alt="Fresh Pasta" 
                        className="w-full h-full object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-4"
                        variants={overlayVariants}
                      >
                        <span className="text-primary-foreground font-medium text-sm">Italian Cuisine</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gold text-gold-foreground px-6 py-3 rounded-full shadow-gold font-semibold text-sm whitespace-nowrap"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -3 }}
                animate={{
                  boxShadow: [
                    '0 4px 20px -4px rgba(var(--gold) / 0.4)',
                    '0 8px 30px -4px rgba(var(--gold) / 0.6)',
                    '0 4px 20px -4px rgba(var(--gold) / 0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-1"
                >
                  ☕
                </motion.span>
                Since 2026 • Bengaluru
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
