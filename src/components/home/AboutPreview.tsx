import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Leaf, Users } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations';
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

export function AboutPreview() {
  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
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
              >
                Our Story
              </motion.span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Welcome to Coffee Nivasa
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Nestled in the heart of Doddanekundi, Bangalore, Coffee Nivasa is more than just a café – it's a haven for coffee lovers and food enthusiasts alike. Our journey began with a simple dream: to create a space where the aroma of freshly brewed coffee meets the warmth of home-cooked meals.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every cup we serve carries the essence of carefully selected beans, and every dish reflects our commitment to authentic flavors and quality ingredients.
              </p>

              <StaggerContainer className="grid sm:grid-cols-3 gap-4 pt-4" staggerDelay={0.15}>
                {features.map((feature) => (
                  <StaggerItem key={feature.title}>
                    <motion.div
                      className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/50"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <motion.div
                        className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3"
                        whileHover={{ rotate: 360 }}
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
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <motion.div
                    className="h-48 rounded-2xl overflow-hidden shadow-card"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img 
                      src={cafeStorefront} 
                      alt="Coffee Nivasa Café" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <motion.div
                    className="h-32 rounded-2xl overflow-hidden shadow-card"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img 
                      src={cappuccinoImg} 
                      alt="Fresh Coffee" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
                <div className="space-y-4 pt-8">
                  <motion.div
                    className="h-32 rounded-2xl overflow-hidden shadow-card"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img 
                      src={sandwichImg} 
                      alt="Delicious Sandwich" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <motion.div
                    className="h-48 rounded-2xl overflow-hidden shadow-card"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img 
                      src={pastaImg} 
                      alt="Fresh Pasta" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gold text-gold-foreground px-6 py-3 rounded-full shadow-gold font-semibold text-sm"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
              >
                Since 2026 • Bengaluru
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
