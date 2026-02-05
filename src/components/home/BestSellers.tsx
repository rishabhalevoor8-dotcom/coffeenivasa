import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem, AnimatedCard } from '@/components/animations';
import cappuccino from '@/assets/menu/cappuccino.jpg';
import sandwich from '@/assets/menu/sandwich.jpg';
import maggi from '@/assets/menu/maggi.jpg';
import vegFriedRice from '@/assets/menu/veg-fried-rice.jpg';
import iceCream from '@/assets/menu/ice-cream.jpg';
import coldCoffee from '@/assets/menu/cold-coffee.jpg';

const bestSellers = [
  {
    name: 'Masala Tea',
    price: '₹25',
    image: cappuccino,
    isVeg: true,
    tag: 'Bestseller',
  },
  {
    name: 'Veg Cheese Sandwich',
    price: '₹65',
    image: sandwich,
    isVeg: true,
    tag: 'Popular',
  },
  {
    name: 'Paneer Maggi',
    price: '₹60',
    image: maggi,
    isVeg: true,
    tag: 'Quick Bite',
  },
  {
    name: 'Veg Fried Rice',
    price: '₹79',
    image: vegFriedRice,
    isVeg: true,
    tag: 'Chef Special',
  },
  {
    name: 'Chocolate Milkshake',
    price: '₹80',
    image: coldCoffee,
    isVeg: true,
    tag: 'Summer Favorite',
  },
  {
    name: 'Hot Chocolate Fudge',
    price: '₹95',
    image: iceCream,
    isVeg: true,
    tag: 'Sweet Delight',
  },
];

const cardVariants: Variants = {
  rest: { 
    scale: 1,
    y: 0,
  },
  hover: { 
    scale: 1.03,
    y: -8,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 20 
    }
  }
};

const imageVariants: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.15,
    transition: { duration: 0.5, ease: 'easeOut' as const }
  }
};

export function BestSellers() {
  return (
    <section className="py-16 md:py-24 bg-gradient-warm overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gold/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl"
          animate={{ scale: [1, 1.1, 1], x: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-2 text-gold font-medium text-sm uppercase tracking-wider mb-3 px-4 py-2 rounded-full bg-gold/10"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Our Favorites</span>
            <Sparkles className="w-4 h-4" />
          </motion.div>
          <motion.h2
            className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Best Sellers
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Discover our most loved dishes, crafted with passion and served with love
          </motion.p>
        </ScrollReveal>

        {/* Menu Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.map((item) => (
            <StaggerItem key={item.name}>
              <motion.div
                className="group bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 cursor-pointer"
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={cardVariants}
                style={{ transformOrigin: 'center bottom' }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <motion.div className="w-full h-full" variants={imageVariants}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  {/* Gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                  {/* Tag */}
                  <motion.div
                    className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-gold text-gold-foreground text-xs font-semibold shadow-gold backdrop-blur-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.tag}
                  </motion.div>
                  {/* Veg Indicator */}
                  <motion.div
                    className="absolute top-3 right-3 w-6 h-6 rounded-md border-2 border-accent bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gold transition-colors duration-300">
                      {item.name}
                    </h3>
                    <motion.span
                      className="text-lg font-bold text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20"
                      whileHover={{ scale: 1.1, backgroundColor: 'hsl(var(--gold) / 0.2)' }}
                    >
                      {item.price}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <ScrollReveal className="text-center mt-10" delay={0.3}>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button variant="default" size="lg" asChild>
              <Link to="/menu">
                View Full Menu
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
