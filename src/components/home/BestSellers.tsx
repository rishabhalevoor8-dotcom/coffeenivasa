import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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

export function BestSellers() {
  return (
    <section className="py-16 md:py-24 bg-gradient-warm overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <motion.span
            className="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Favorites
          </motion.span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Best Sellers
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover our most loved dishes, crafted with passion and served with love
          </p>
        </ScrollReveal>

        {/* Menu Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.map((item) => (
            <StaggerItem key={item.name}>
              <AnimatedCard className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border/50 hover:border-gold/30">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Tag */}
                  <motion.div
                    className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-gold text-gold-foreground text-xs font-semibold shadow-gold"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    {item.tag}
                  </motion.div>
                  {/* Veg Indicator */}
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-md border-2 border-accent bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gold transition-colors duration-200">
                      {item.name}
                    </h3>
                    <motion.span
                      className="text-lg font-bold text-gold bg-gold/10 px-3 py-1 rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.price}
                    </motion.span>
                  </div>
                </div>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <ScrollReveal className="text-center mt-10" delay={0.3}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="default" size="lg" asChild>
              <Link to="/menu">
                View Full Menu
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
